from __future__ import annotations

from typing import Any, Protocol

from idealize_contracts import ArtifactType, MessageRole, Stage


class RagPort(Protocol):
    """Vector store / RAG indexing and retrieval."""

    def index_text(
        self,
        *,
        project_id: str,
        text: str,
        stage: Stage | None,
        artifact_type: ArtifactType | None,
        source_role: MessageRole | None,
        extra_metadata: dict[str, Any] | None = None,
    ) -> None:
        ...

    def retrieve_context(self, *, project_id: str, query: str, limit: int = 8) -> str:
        ...
