from __future__ import annotations

from typing import Any, TypedDict

from idealize_contracts import Stage

from idealize_ai.ports.llm import LlmPort
from idealize_ai.ports.orchestration import OrchestrationPort


class _WorkflowState(TypedDict, total=False):
    project_id: str
    node: str
    stage: str
    prompt: str
    llm_output: str
    retrieved_context: str
    references: list[dict[str, Any]]
    context_excerpt: str


class LangGraphOrchestrator(OrchestrationPort):
    """Workflow adapter that models stage nodes in a LangGraph-like boundary."""

    def __init__(self, llm: LlmPort) -> None:
        self._llm = llm

    def run_node(
        self,
        *,
        project_id: str,
        node: str,
        stage: Stage,
        state: dict[str, Any],
    ) -> dict[str, Any]:
        workflow_state: _WorkflowState = {
            "project_id": project_id,
            "node": node,
            "stage": stage.value,
            "prompt": str(state.get("prompt", "")),
            "retrieved_context": str(state.get("retrieved_context", "")),
            "references": list(state.get("references", [])),
        }
        context_excerpt = (workflow_state.get("retrieved_context") or "")[:1200]
        workflow_state["context_excerpt"] = context_excerpt
        llm_output = self._invoke_with_langgraph(workflow_state, stage=stage)
        workflow_state["llm_output"] = llm_output
        return dict(workflow_state)

    def _invoke_with_langgraph(self, state: _WorkflowState, *, stage: Stage) -> str:
        try:
            from langgraph.graph import END, START, StateGraph
        except Exception:
            return self._complete(state, stage=stage)

        graph = StateGraph(_WorkflowState)

        def _node(payload: _WorkflowState) -> _WorkflowState:
            output = self._complete(payload, stage=stage)
            return {"llm_output": output}

        graph.add_node(state["node"], _node)
        graph.add_edge(START, state["node"])
        graph.add_edge(state["node"], END)
        compiled = graph.compile()
        result = compiled.invoke(state)
        return str(result.get("llm_output", "")).strip()

    def _complete(self, state: _WorkflowState, *, stage: Stage) -> str:
        return self._llm.complete(
            prompt=str(state.get("prompt", "")),
            metadata={
                "project_id": state.get("project_id"),
                "node": state.get("node"),
                "stage": stage.value,
            },
        )
