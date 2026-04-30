from __future__ import annotations

from typing import Any, Protocol


class LlmPort(Protocol):
    """Abstraction for LLM calls; MVP may use a deterministic stub in tests."""

    def complete(self, *, prompt: str, metadata: dict[str, Any] | None = None) -> str: ...
