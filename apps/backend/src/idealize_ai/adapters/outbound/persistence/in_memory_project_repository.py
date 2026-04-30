from __future__ import annotations

from collections import defaultdict

from idealize_ai.domain.entities import Artifact, Message, Project
from idealize_ai.ports.repositories import ProjectRepository


class InMemoryProjectRepository(ProjectRepository):
    """Process-local transactional store for MVP demonstrations."""

    def __init__(self) -> None:
        self._projects: dict[str, Project] = {}
        self._messages: dict[str, list[Message]] = defaultdict(list)
        self._artifacts: dict[str, list[Artifact]] = defaultdict(list)

    def save_project(self, project: Project) -> None:
        self._projects[project.id] = project

    def get_project(self, project_id: str) -> Project | None:
        return self._projects.get(project_id)

    def add_message(self, message: Message) -> None:
        self._messages[message.project_id].append(message)

    def list_messages(self, project_id: str) -> list[Message]:
        return list(self._messages.get(project_id, []))

    def add_artifact(self, artifact: Artifact) -> None:
        self._artifacts[artifact.project_id].append(artifact)

    def list_artifacts(self, project_id: str) -> list[Artifact]:
        items = list(self._artifacts.get(project_id, []))
        return sorted(items, key=lambda a: a.created_at)
