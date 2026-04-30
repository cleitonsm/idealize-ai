from __future__ import annotations

from collections import defaultdict
from typing import Any

from idealize_contracts import ArtifactType, MessageRole, Stage

from idealize_ai.ports.rag import RagPort


class InMemoryRag(RagPort):
    """Minimal RAG double: stores text per project and returns recent chunks as context."""

    def __init__(self) -> None:
        self._chunks: dict[str, list[str]] = defaultdict(list)

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
        _ = (stage, artifact_type, source_role, extra_metadata)
        if text.strip():
            self._chunks[project_id].append(text.strip())

    def retrieve_context(self, *, project_id: str, query: str, limit: int = 8) -> str:
        _ = query
        seq = self._chunks.get(project_id, [])
        if not seq:
            return ""
        tail = seq[-limit:] if limit > 0 else seq
        return "\n\n---\n\n".join(tail)
