from __future__ import annotations

from typing import Any, Protocol

from idealize_contracts import Stage


class OrchestrationPort(Protocol):
    """LangGraph / workflow orchestration boundary."""

    def run_node(
        self,
        *,
        project_id: str,
        node: str,
        stage: Stage,
        state: dict[str, Any],
    ) -> dict[str, Any]:
        ...
