from __future__ import annotations

import hashlib
from datetime import UTC, datetime
from typing import Any

from idealize_contracts import (  # type: ignore[import-untyped]
    ArtifactType,
    MessageRole,
    Stage,
)

from idealize_ai.adapters.outbound.rag.in_memory_rag import InMemoryRag
from idealize_ai.ports.rag import RagPort


def _utc_iso_now() -> str:
    return datetime.now(UTC).isoformat()


class ChromaRag(RagPort):
    """Chroma-backed RAG adapter with safe in-memory fallback."""

    def __init__(
        self,
        *,
        host: str,
        port: int,
        collection_name: str,
        fallback: RagPort | None = None,
    ) -> None:
        self._fallback = fallback or InMemoryRag()
        self._collection = None
        self._enabled = False
        try:
            import chromadb  # type: ignore[import-not-found]
        except Exception:
            return

        try:
            client = chromadb.HttpClient(host=host, port=port)
            self._collection = client.get_or_create_collection(
                name=collection_name
            )
            self._enabled = True
        except Exception:
            self._collection = None
            self._enabled = False

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
        metadata = {
            "project_id": project_id,
            "stage": stage.value if stage else "",
            "artifact_type": artifact_type.value if artifact_type else "",
            "source_role": source_role.value if source_role else "",
            "created_at": _utc_iso_now(),
        }
        if extra_metadata:
            metadata.update(extra_metadata)

        clean_text = text.strip()
        if not clean_text:
            return

        if self._enabled and self._collection is not None:
            try:
                doc_id = hashlib.sha256(
                    (
                        f"{project_id}|{metadata['created_at']}|"
                        f"{clean_text[:200]}"
                    ).encode()
                ).hexdigest()
                self._collection.add(
                    ids=[doc_id],
                    documents=[clean_text],
                    metadatas=[metadata],
                )
                return
            except Exception:
                self._enabled = False

        self._fallback.index_text(
            project_id=project_id,
            text=clean_text,
            stage=stage,
            artifact_type=artifact_type,
            source_role=source_role,
            extra_metadata=metadata,
        )

    def retrieve_context(
        self,
        *,
        project_id: str,
        query: str,
        limit: int = 8,
    ) -> str:
        if self._enabled and self._collection is not None:
            try:
                result = self._collection.get(
                    where={"project_id": project_id},
                    limit=max(limit, 1),
                )
                documents = (
                    result.get("documents", [])
                    if isinstance(result, dict)
                    else []
                )
                items = [
                    item.strip()
                    for item in documents
                    if isinstance(item, str) and item.strip()
                ]
                if items:
                    return "\n\n---\n\n".join(items[-limit:])
            except Exception:
                self._enabled = False

        return self._fallback.retrieve_context(
            project_id=project_id,
            query=query,
            limit=limit,
        )
