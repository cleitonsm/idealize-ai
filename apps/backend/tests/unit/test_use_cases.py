from __future__ import annotations

from typing import Any

import pytest
from idealize_contracts import ArtifactType, MessageRole, Stage

from idealize_ai.adapters.outbound.persistence.in_memory_project_repository import (
    InMemoryProjectRepository,
)
from idealize_ai.adapters.outbound.rag.in_memory_rag import InMemoryRag
from idealize_ai.application.use_cases import (
    AdvanceStageInput,
    CreateProjectInput,
    GenerateArtifactInput,
    RegisterInitialIdeaInput,
    advance_project_stage,
    create_project,
    generate_artifact,
    get_project_history,
    list_artifacts,
    register_initial_idea,
)
from idealize_ai.domain.exceptions import InvalidStageTransitionError, ProjectNotFoundError


class FakeDocumentGenerator:
    def __init__(self) -> None:
        self.last_trace = {
            "node": "node_requirements",
            "prompt_id": "requirements__user_story",
        }
        self.calls: list[dict[str, Any]] = []

    def generate(
        self,
        *,
        project_id: str,
        artifact_type: ArtifactType,
        stage: Stage,
        context_text: str,
        title_override: str | None,
    ) -> tuple[str, str]:
        self.calls.append(
            {
                "project_id": project_id,
                "artifact_type": artifact_type,
                "stage": stage,
                "context_text": context_text,
                "title_override": title_override,
            }
        )
        return title_override or "Generated artifact", f"Draft from context: {context_text}"


def test_project_creation_trims_input_and_starts_in_initial_idea() -> None:
    repo = InMemoryProjectRepository()

    project = create_project(
        repo,
        CreateProjectInput(name="  Clinica Conecta  ", description="  Demo MVP  "),
    )

    assert project.name == "Clinica Conecta"
    assert project.description == "Demo MVP"
    assert project.current_stage is Stage.INITIAL_IDEA
    assert repo.get_project(project.id) == project


def test_register_initial_idea_persists_history_and_indexes_rag_context() -> None:
    repo = InMemoryProjectRepository()
    rag = InMemoryRag()
    project = create_project(repo, CreateProjectInput(name="Clinica Conecta"))

    _, message = register_initial_idea(
        repo,
        rag,
        RegisterInitialIdeaInput(
            project_id=project.id,
            content="  Reduzir faltas em consultas  ",
            metadata={"source": "demo"},
        ),
    )

    assert message.content == "Reduzir faltas em consultas"
    assert message.role is MessageRole.USER
    assert message.stage is Stage.INITIAL_IDEA
    assert get_project_history(repo, project.id) == [message]
    assert rag.retrieve_context(project_id=project.id, query="faltas") == message.content


def test_advance_project_stage_enforces_linear_flow() -> None:
    repo = InMemoryProjectRepository()
    project = create_project(repo, CreateProjectInput(name="Clinica Conecta"))

    updated = advance_project_stage(
        repo,
        AdvanceStageInput(project_id=project.id, target_stage=Stage.INTERVIEW),
    )

    assert updated.current_stage is Stage.INTERVIEW
    with pytest.raises(InvalidStageTransitionError):
        advance_project_stage(
            repo,
            AdvanceStageInput(project_id=project.id, target_stage=Stage.REQUIREMENTS),
        )


def test_generate_artifact_uses_rag_context_and_indexes_generated_artifact() -> None:
    repo = InMemoryProjectRepository()
    rag = InMemoryRag()
    generator = FakeDocumentGenerator()
    project = create_project(repo, CreateProjectInput(name="Clinica Conecta"))
    register_initial_idea(
        repo,
        rag,
        RegisterInitialIdeaInput(project_id=project.id, content="Fila unica de confirmacoes"),
    )
    advance_project_stage(
        repo,
        AdvanceStageInput(project_id=project.id, target_stage=Stage.INTERVIEW),
    )
    advance_project_stage(
        repo,
        AdvanceStageInput(project_id=project.id, target_stage=Stage.BRAINSTORMING),
    )
    advance_project_stage(
        repo,
        AdvanceStageInput(project_id=project.id, target_stage=Stage.REQUIREMENTS),
    )

    artifact = generate_artifact(
        repo,
        rag,
        generator,
        GenerateArtifactInput(
            project_id=project.id,
            artifact_type=ArtifactType.USER_STORY,
            title="Historias de usuario",
        ),
    )

    assert artifact.title == "Historias de usuario"
    assert artifact.stage is Stage.REQUIREMENTS
    assert artifact.source_context == "Fila unica de confirmacoes"
    assert artifact.metadata["trace"]["prompt_id"] == "requirements__user_story"
    assert artifact.metadata["rag"]["context_chars"] == len("Fila unica de confirmacoes")
    assert list_artifacts(repo, project.id) == [artifact]
    assert generator.calls[0]["context_text"] == "Fila unica de confirmacoes"
    assert "Historias de usuario" in rag.retrieve_context(project_id=project.id, query="historias")


def test_missing_project_use_cases_raise_domain_error() -> None:
    repo = InMemoryProjectRepository()
    rag = InMemoryRag()
    generator = FakeDocumentGenerator()

    with pytest.raises(ProjectNotFoundError):
        register_initial_idea(
            repo,
            rag,
            RegisterInitialIdeaInput(project_id="missing", content="x"),
        )
    with pytest.raises(ProjectNotFoundError):
        list_artifacts(repo, "missing")
    with pytest.raises(ProjectNotFoundError):
        generate_artifact(
            repo,
            rag,
            generator,
            GenerateArtifactInput(project_id="missing", artifact_type=ArtifactType.OTHER),
        )
