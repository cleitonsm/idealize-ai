from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request
from idealize_contracts import Artifact, ArtifactType, Message, Project, Stage
from pydantic import BaseModel, ConfigDict, Field

from idealize_ai.application.mappers import (
    artifact_to_contract,
    message_to_contract,
    project_to_contract,
)
from idealize_ai.application.use_cases import (
    AdvanceStageInput,
    CreateProjectInput,
    GenerateArtifactInput,
    RegisterInitialIdeaInput,
    advance_project_stage,
    create_project,
    generate_artifact,
    get_project,
    get_project_history,
    list_artifacts,
    register_initial_idea,
)
from idealize_ai.domain.stage_flow import next_stage
from idealize_ai.ports.document_generation import DocumentGeneratorPort
from idealize_ai.ports.rag import RagPort
from idealize_ai.ports.repositories import ProjectRepository

router = APIRouter()


def _repo(request: Request) -> ProjectRepository:
    return request.app.state.repository


def _rag(request: Request) -> RagPort:
    return request.app.state.rag


def _generator(request: Request) -> DocumentGeneratorPort:
    return request.app.state.document_generator


class CreateProjectBody(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    name: str
    description: str | None = None


class RegisterIdeaBody(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    content: str
    metadata: dict | None = Field(default=None)


class AdvanceStageBody(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    target_stage: Stage | None = Field(default=None, alias="targetStage")


class GenerateArtifactBody(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    artifact_type: ArtifactType = Field(alias="type")
    title: str | None = None


@router.post("", response_model=Project, status_code=201)
def create_project_route(
    request: Request,
    body: CreateProjectBody,
) -> Project:
    name = body.name.strip()
    if not name:
        raise HTTPException(status_code=422, detail="name must not be empty")
    project = create_project(
        _repo(request),
        CreateProjectInput(name=name, description=body.description),
    )
    return project_to_contract(project)


@router.get("/{project_id}", response_model=Project)
def get_project_route(request: Request, project_id: str) -> Project:
    project = get_project(_repo(request), project_id)
    return project_to_contract(project)


@router.post("/{project_id}/idea", response_model=dict)
def register_idea_route(
    request: Request,
    project_id: str,
    body: RegisterIdeaBody,
) -> dict:
    content = body.content.strip()
    if not content:
        raise HTTPException(status_code=422, detail="content must not be empty")
    project, message = register_initial_idea(
        _repo(request),
        _rag(request),
        RegisterInitialIdeaInput(
            project_id=project_id,
            content=content,
            metadata=body.metadata,
        ),
    )
    return {
        "project": project_to_contract(project).model_dump(mode="json", by_alias=True),
        "message": message_to_contract(message).model_dump(mode="json", by_alias=True),
    }


@router.post("/{project_id}/advance", response_model=Project)
def advance_stage_route(
    request: Request,
    project_id: str,
    body: AdvanceStageBody = AdvanceStageBody(),
) -> Project:
    repo = _repo(request)
    project = get_project(repo, project_id)
    target: Stage
    if body.target_stage is None:
        nxt = next_stage(project.current_stage)
        if nxt is None:
            raise HTTPException(
                status_code=400,
                detail="Project is already in the final stage",
            )
        target = nxt
    else:
        target = body.target_stage
    updated = advance_project_stage(
        repo,
        AdvanceStageInput(project_id=project_id, target_stage=target),
    )
    return project_to_contract(updated)


@router.post("/{project_id}/artifacts", response_model=Artifact, status_code=201)
def generate_artifact_route(
    request: Request,
    project_id: str,
    body: GenerateArtifactBody,
) -> Artifact:
    artifact = generate_artifact(
        _repo(request),
        _rag(request),
        _generator(request),
        GenerateArtifactInput(
            project_id=project_id,
            artifact_type=body.artifact_type,
            title=body.title,
        ),
    )
    return artifact_to_contract(artifact)


@router.get("/{project_id}/artifacts", response_model=list[Artifact])
def list_artifacts_route(request: Request, project_id: str) -> list[Artifact]:
    artifacts = list_artifacts(_repo(request), project_id)
    return [artifact_to_contract(a) for a in artifacts]


@router.get("/{project_id}/history", response_model=list[Message])
def history_route(request: Request, project_id: str) -> list[Message]:
    messages = get_project_history(_repo(request), project_id)
    return [message_to_contract(m) for m in messages]
