from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

from idealize_contracts import ArtifactType, Stage

from idealize_ai.application.prompts import StagePromptRegistry
from idealize_ai.ports.document_generation import DocumentGeneratorPort
from idealize_ai.ports.orchestration import OrchestrationPort


def _title_for(*, artifact_type: ArtifactType, stage: Stage) -> str:
    return f"{artifact_type.value.replace('_', ' ').title()} ({stage.value})"


class TraceableDocumentGenerator(DocumentGeneratorPort):
    """Generates artifacts with stage prompts and workflow traceability."""

    def __init__(
        self,
        *,
        orchestrator: OrchestrationPort,
        prompts: StagePromptRegistry,
    ) -> None:
        self._orchestrator = orchestrator
        self._prompts = prompts
        self._last_trace: dict[str, Any] = {}

    @property
    def last_trace(self) -> dict[str, Any]:
        return dict(self._last_trace)

    def generate(
        self,
        *,
        project_id: str,
        artifact_type: ArtifactType,
        stage: Stage,
        context_text: str,
        title_override: str | None,
    ) -> tuple[str, str]:
        selection = self._prompts.select(stage=stage, artifact_type=artifact_type)
        prompt = (
            f"{selection.prompt_text}\n\n"
            f"Project ID: {project_id}\n"
            f"Stage: {stage.value}\n"
            f"Artifact Type: {artifact_type.value}\n\n"
            f"Context:\n{context_text.strip() or '(no context)'}"
        )
        node = f"node_{stage.value}"
        state = self._orchestrator.run_node(
            project_id=project_id,
            node=node,
            stage=stage,
            state={
                "prompt": prompt,
                "retrieved_context": context_text,
                "references": [],
            },
        )
        ai_text = str(state.get("llm_output") or "").strip() or "No output generated."
        title = title_override or _title_for(artifact_type=artifact_type, stage=stage)
        generated_at = datetime.now(UTC).replace(tzinfo=None).isoformat()
        body = (
            f"# {title}\n\n"
            f"**Project:** `{project_id}`  \n"
            f"**Stage:** `{stage.value}`  \n"
            f"**Type:** `{artifact_type.value}`  \n"
            f"**Prompt Id:** `{selection.prompt_id}`\n\n"
            "## AI Draft\n\n"
            f"{ai_text}\n\n"
            "## Context used\n\n"
            f"{context_text.strip() or '_No indexed context yet._'}\n\n"
            "---\n\n"
            f"_Generated at: {generated_at}_\n"
        )
        self._last_trace = {
            "node": node,
            "prompt_id": selection.prompt_id,
            "stage": stage.value,
            "artifact_type": artifact_type.value,
            "generated_at": generated_at,
        }
        return title, body
