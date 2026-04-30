from __future__ import annotations

from datetime import datetime
from enum import StrEnum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class Stage(StrEnum):
    INITIAL_IDEA = "initial_idea"
    INTERVIEW = "interview"
    BRAINSTORMING = "brainstorming"
    REQUIREMENTS = "requirements"
    BUSINESS_CASE = "business_case"
    STACK_MODELING = "stack_modeling"
    MODELING = "modeling"
    REVIEW = "review"


class MessageRole(StrEnum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ArtifactStatus(StrEnum):
    DRAFT = "draft"
    IN_PROGRESS = "in_progress"
    GENERATED = "generated"
    REVIEWED = "reviewed"
    NEEDS_INPUT = "needs_input"


class ArtifactType(StrEnum):
    PROBLEM_SOLUTION = "problem_solution"
    VALUE_PROPOSITION = "value_proposition"
    EPIC = "epic"
    USER_STORY = "user_story"
    ACCEPTANCE_CRITERIA = "acceptance_criteria"
    MARKET_ANALYSIS = "market_analysis"
    BUSINESS_MODEL = "business_model"
    DIAGRAM_MERMAID = "diagram_mermaid"
    OTHER = "other"


class Project(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    id: str
    name: str
    description: str | None = None
    current_stage: Stage = Field(alias="currentStage")
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")


class Message(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    id: str
    project_id: str = Field(alias="projectId")
    role: MessageRole
    content: str
    stage: Stage | None = None
    created_at: datetime = Field(alias="createdAt")
    metadata: dict[str, Any] | None = None


class Artifact(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    id: str
    project_id: str = Field(alias="projectId")
    type: ArtifactType
    title: str
    content: str
    stage: Stage
    status: ArtifactStatus
    source_context: str | None = Field(default=None, alias="sourceContext")
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")
    metadata: dict[str, Any] | None = None


class AcceptanceCriteria(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    id: str
    description: str
    satisfied: bool | None = None


class UserStory(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    id: str
    title: str
    narrative: str
    epic_id: str | None = Field(default=None, alias="epicId")
    acceptance_criteria: list[AcceptanceCriteria] = Field(alias="acceptanceCriteria")
    metadata: dict[str, Any] | None = None


class Epic(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    id: str
    project_id: str = Field(alias="projectId")
    title: str
    summary: str | None = None
    user_stories: list[UserStory] = Field(alias="userStories")
    metadata: dict[str, Any] | None = None
