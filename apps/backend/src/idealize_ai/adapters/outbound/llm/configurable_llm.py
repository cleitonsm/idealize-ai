from __future__ import annotations

from typing import Any

from idealize_ai.ports.llm import LlmPort


class ConfigurableLlm(LlmPort):
    """MVP LLM adapter with deterministic fallback output."""

    def __init__(self, *, provider: str, api_key: str, model: str) -> None:
        self._provider = provider.strip().lower()
        self._api_key = api_key.strip()
        self._model = model.strip() or "deterministic-mvp"

    @property
    def provider(self) -> str:
        return self._provider or "deterministic"

    @property
    def model(self) -> str:
        return self._model

    def complete(self, *, prompt: str, metadata: dict[str, Any] | None = None) -> str:
        _ = metadata
        prompt = prompt.strip()
        if not prompt:
            return "No prompt was provided."

        # MVP keeps calls deterministic by default while preserving a clean LLM boundary.
        lines = [line.strip() for line in prompt.splitlines() if line.strip()]
        excerpt = " ".join(lines[-3:])[:800]
        return (
            "AI draft based on stage prompt and retrieved context.\n\n"
            f"- provider: {self.provider}\n"
            f"- model: {self.model}\n"
            f"- synthesis: {excerpt or 'insufficient context'}\n"
        )
