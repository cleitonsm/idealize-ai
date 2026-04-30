from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from idealize_contracts import ArtifactStatus, ArtifactType, MessageRole, Stage


@dataclass
class Project:
    id: str
    name: str
    description: str | None
    current_stage: Stage
    created_at: datetime
    updated_at: datetime


@dataclass
class Message:
    id: str
    project_id: str
    role: MessageRole
    content: str
    stage: Stage | None
    created_at: datetime
    metadata: dict[str, Any] | None = None


@dataclass
class Artifact:
    id: str
    project_id: str
    type: ArtifactType
    title: str
    content: str
    stage: Stage
    status: ArtifactStatus
    source_context: str | None
    created_at: datetime
    updated_at: datetime
    metadata: dict[str, Any] | None = None


@dataclass
class Epic:
    id: str
    project_id: str
    title: str
    summary: str | None = None
    user_story_ids: list[str] = field(default_factory=list)
    metadata: dict[str, Any] | None = None


@dataclass
class AcceptanceCriteria:
    id: str
    description: str
    satisfied: bool | None = None


@dataclass
class UserStory:
    id: str
    title: str
    narrative: str
    epic_id: str | None
    acceptance_criteria: list[AcceptanceCriteria]
    metadata: dict[str, Any] | None = None
