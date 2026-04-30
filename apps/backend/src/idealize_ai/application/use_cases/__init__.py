from __future__ import annotations

import uuid
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any

from idealize_contracts import (
    ArtifactStatus,
    ArtifactType,
    MessageRole,
    Stage,
)

from idealize_ai.domain.entities import Artifact, Message, Project
from idealize_ai.domain.exceptions import InvalidStageTransitionError, ProjectNotFoundError
from idealize_ai.domain.stage_flow import can_advance_to
from idealize_ai.ports.document_generation import DocumentGeneratorPort
from idealize_ai.ports.rag import RagPort
from idealize_ai.ports.repositories import ProjectRepository


def _utc_now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


@dataclass(frozen=True)
class CreateProjectInput:
    name: str
    description: str | None = None


def create_project(
    repo: ProjectRepository,
    data: CreateProjectInput,
) -> Project:
    now = _utc_now()
    project_id = str(uuid.uuid4())
    project = Project(
        id=project_id,
        name=data.name.strip(),
        description=data.description.strip() if data.description else None,
        current_stage=Stage.INITIAL_IDEA,
        created_at=now,
        updated_at=now,
    )
    repo.save_project(project)
    return project


def get_project(repo: ProjectRepository, project_id: str) -> Project:
    project = repo.get_project(project_id)
    if project is None:
        raise ProjectNotFoundError(project_id)
    return project


@dataclass(frozen=True)
class RegisterInitialIdeaInput:
    project_id: str
    content: str
    metadata: dict[str, Any] | None = None


def register_initial_idea(
    repo: ProjectRepository,
    rag: RagPort,
    data: RegisterInitialIdeaInput,
) -> tuple[Project, Message]:
    project = repo.get_project(data.project_id)
    if project is None:
        raise ProjectNotFoundError(data.project_id)
    now = _utc_now()
    user_message = Message(
        id=str(uuid.uuid4()),
        project_id=data.project_id,
        role=MessageRole.USER,
        content=data.content.strip(),
        stage=project.current_stage,
        created_at=now,
        metadata=data.metadata,
    )
    repo.add_message(user_message)
    rag.index_text(
        project_id=data.project_id,
        text=user_message.content,
        stage=project.current_stage,
        artifact_type=None,
        source_role=MessageRole.USER,
        extra_metadata={"kind": "initial_idea"},
    )
    project = Project(
        id=project.id,
        name=project.name,
        description=project.description,
        current_stage=project.current_stage,
        created_at=project.created_at,
        updated_at=now,
    )
    repo.save_project(project)
    return project, user_message


@dataclass(frozen=True)
class AdvanceStageInput:
    project_id: str
    target_stage: Stage


def advance_project_stage(
    repo: ProjectRepository,
    data: AdvanceStageInput,
) -> Project:
    project = repo.get_project(data.project_id)
    if project is None:
        raise ProjectNotFoundError(data.project_id)
    if not can_advance_to(project.current_stage, data.target_stage):
        raise InvalidStageTransitionError(
            current=project.current_stage.value,
            target=data.target_stage.value,
        )
    now = _utc_now()
    updated = Project(
        id=project.id,
        name=project.name,
        description=project.description,
        current_stage=data.target_stage,
        created_at=project.created_at,
        updated_at=now,
    )
    repo.save_project(updated)
    return updated


@dataclass(frozen=True)
class GenerateArtifactInput:
    project_id: str
    artifact_type: ArtifactType
    title: str | None = None


def generate_artifact(
    repo: ProjectRepository,
    rag: RagPort,
    generator: DocumentGeneratorPort,
    data: GenerateArtifactInput,
) -> Artifact:
    project = repo.get_project(data.project_id)
    if project is None:
        raise ProjectNotFoundError(data.project_id)
    messages = repo.list_messages(data.project_id)
    context_parts = [m.content for m in messages[-50:]]
    context_text = rag.retrieve_context(
        project_id=data.project_id,
        query=" ".join(context_parts)[:2000],
        limit=8,
    )
    if not context_text.strip():
        context_text = "\n\n".join(context_parts) if context_parts else "(no prior inputs)"
    title, body = generator.generate(
        project_id=data.project_id,
        artifact_type=data.artifact_type,
        stage=project.current_stage,
        context_text=context_text,
        title_override=data.title,
    )
    now = _utc_now()
    artifact = Artifact(
        id=str(uuid.uuid4()),
        project_id=data.project_id,
        type=data.artifact_type,
        title=title,
        content=body,
        stage=project.current_stage,
        status=ArtifactStatus.GENERATED,
        source_context=context_text[:8000] if context_text else None,
        created_at=now,
        updated_at=now,
        metadata=None,
    )
    repo.add_artifact(artifact)
    rag.index_text(
        project_id=data.project_id,
        text=f"{artifact.title}\n{artifact.content}",
        stage=artifact.stage,
        artifact_type=artifact.type,
        source_role=None,
        extra_metadata={"artifact_id": artifact.id},
    )
    p_now = _utc_now()
    repo.save_project(
        Project(
            id=project.id,
            name=project.name,
            description=project.description,
            current_stage=project.current_stage,
            created_at=project.created_at,
            updated_at=p_now,
        )
    )
    return artifact


def list_artifacts(repo: ProjectRepository, project_id: str) -> list[Artifact]:
    if repo.get_project(project_id) is None:
        raise ProjectNotFoundError(project_id)
    return repo.list_artifacts(project_id)


def get_project_history(repo: ProjectRepository, project_id: str) -> list[Message]:
    if repo.get_project(project_id) is None:
        raise ProjectNotFoundError(project_id)
    return sorted(repo.list_messages(project_id), key=lambda m: m.created_at)


__all__ = [
    "AdvanceStageInput",
    "CreateProjectInput",
    "GenerateArtifactInput",
    "RegisterInitialIdeaInput",
    "advance_project_stage",
    "create_project",
    "generate_artifact",
    "get_project",
    "get_project_history",
    "list_artifacts",
    "register_initial_idea",
]
