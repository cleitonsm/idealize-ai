from __future__ import annotations

from idealize_contracts import ArtifactType, Stage

from idealize_ai.ports.document_generation import DocumentGeneratorPort


class StubDocumentGenerator(DocumentGeneratorPort):
    """Deterministic placeholder output until LLM-backed generation is wired."""

    def generate(
        self,
        *,
        project_id: str,
        artifact_type: ArtifactType,
        stage: Stage,
        context_text: str,
        title_override: str | None,
    ) -> tuple[str, str]:
        title = title_override or f"{artifact_type.value.replace('_', ' ').title()} ({stage.value})"
        body = (
            f"# {title}\n\n"
            f"**Project:** `{project_id}`  \n"
            f"**Stage:** `{stage.value}`  \n"
            f"**Type:** `{artifact_type.value}`  \n\n"
            "## Context used\n\n"
            f"{context_text.strip() or '_No indexed context yet._'}\n\n"
            "---\n\n"
            "_This artifact was produced by the MVP stub generator._"
        )
        return title, body
