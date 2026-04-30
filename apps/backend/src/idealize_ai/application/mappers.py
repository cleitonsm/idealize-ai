from __future__ import annotations

from idealize_contracts import (
    Artifact as ContractArtifact,
)
from idealize_contracts import (
    Message as ContractMessage,
)
from idealize_contracts import (
    Project as ContractProject,
)

from idealize_ai.domain import entities as domain


def project_to_contract(entity: domain.Project) -> ContractProject:
    return ContractProject(
        id=entity.id,
        name=entity.name,
        description=entity.description,
        currentStage=entity.current_stage,
        createdAt=entity.created_at,
        updatedAt=entity.updated_at,
    )


def message_to_contract(entity: domain.Message) -> ContractMessage:
    return ContractMessage(
        id=entity.id,
        projectId=entity.project_id,
        role=entity.role,
        content=entity.content,
        stage=entity.stage,
        createdAt=entity.created_at,
        metadata=entity.metadata,
    )


def artifact_to_contract(entity: domain.Artifact) -> ContractArtifact:
    return ContractArtifact(
        id=entity.id,
        projectId=entity.project_id,
        type=entity.type,
        title=entity.title,
        content=entity.content,
        stage=entity.stage,
        status=entity.status,
        sourceContext=entity.source_context,
        createdAt=entity.created_at,
        updatedAt=entity.updated_at,
        metadata=entity.metadata,
    )
