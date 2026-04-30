from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from idealize_contracts import ArtifactType, Stage

_DEFAULT_STAGE_PROMPTS: dict[Stage, str] = {
    Stage.INTERVIEW: (
        "You are a Product Owner agent. Conduct a concise stakeholder interview synthesis and "
        "extract pains, goals, constraints, and open questions."
    ),
    Stage.BRAINSTORMING: (
        "You are a Product Discovery facilitator. Expand alternatives, cluster ideas, and "
        "highlight trade-offs."
    ),
    Stage.REQUIREMENTS: (
        "You are a Product Owner agent. Convert context into epics, user stories, and "
        "acceptance criteria grounded in evidence."
    ),
    Stage.BUSINESS_CASE: (
        "You are a Strategy analyst. Draft problem/solution fit, market assumptions, risks, and "
        "business model hypotheses."
    ),
    Stage.STACK_MODELING: (
        "You are a Solution Architect. Propose stack and infrastructure choices with rationale "
        "based on constraints."
    ),
    Stage.MODELING: (
        "You are a Solution Architect. Produce implementation-oriented modeling notes and valid "
        "Mermaid snippets when useful."
    ),
}


def _discover_prompts_dir() -> Path | None:
    current = Path(__file__).resolve()
    for parent in current.parents:
        candidate = parent / "packages" / "prompts" / "stages"
        if candidate.exists() and candidate.is_dir():
            return candidate
    return None


def _sanitize_key(value: str) -> str:
    return "".join(ch if ch.isalnum() else "_" for ch in value).strip("_")


@dataclass(frozen=True)
class PromptSelection:
    prompt_text: str
    prompt_id: str


class StagePromptRegistry:
    def __init__(self, prompts_dir: str | None = None) -> None:
        discovered = _discover_prompts_dir()
        self._base_dir = Path(prompts_dir).resolve() if prompts_dir else discovered

    def select(self, *, stage: Stage, artifact_type: ArtifactType) -> PromptSelection:
        custom = self._read_prompt_file(stage=stage, artifact_type=artifact_type)
        prompt_text = custom or _DEFAULT_STAGE_PROMPTS.get(
            stage,
            "You are an AI copilot. Produce structured and concise output grounded in context.",
        )
        prompt_id = f"{_sanitize_key(stage.value)}__{_sanitize_key(artifact_type.value)}"
        return PromptSelection(prompt_text=prompt_text.strip(), prompt_id=prompt_id)

    def _read_prompt_file(self, *, stage: Stage, artifact_type: ArtifactType) -> str | None:
        if self._base_dir is None:
            return None

        specific = self._base_dir / f"{stage.value}__{artifact_type.value}.md"
        generic = self._base_dir / f"{stage.value}.md"
        for candidate in (specific, generic):
            if candidate.exists() and candidate.is_file():
                text = candidate.read_text(encoding="utf-8").strip()
                if text:
                    return text
        return None
