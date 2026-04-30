from __future__ import annotations

from typing import Protocol

from idealize_contracts import ArtifactType, Stage


class DocumentGeneratorPort(Protocol):
    """Produces title and Markdown body for an artifact from project context."""

    def generate(
        self,
        *,
        project_id: str,
        artifact_type: ArtifactType,
        stage: Stage,
        context_text: str,
        title_override: str | None,
    ) -> tuple[str, str]:
        """Return (title, markdown_content)."""
        ...
