from __future__ import annotations

from datetime import UTC, datetime, timedelta

from idealize_contracts import ArtifactStatus, ArtifactType, MessageRole, Stage

from idealize_ai.adapters.outbound.generation.traceable_document_generator import (
    TraceableDocumentGenerator,
)
from idealize_ai.adapters.outbound.persistence.in_memory_project_repository import (
    InMemoryProjectRepository,
)
from idealize_ai.adapters.outbound.persistence.sqlite_project_repository import (
    SqliteProjectRepository,
)
from idealize_ai.adapters.outbound.rag.in_memory_rag import InMemoryRag
from idealize_ai.application.prompts import StagePromptRegistry
from idealize_ai.domain.entities import Artifact, Message, Project


class FakeOrchestrator:
    def __init__(self) -> None:
        self.calls: list[dict] = []

    def run_node(
        self,
        *,
        project_id: str,
        node: str,
        stage: Stage,
        state: dict,
    ) -> dict:
        self.calls.append(
            {
                "project_id": project_id,
                "node": node,
                "stage": stage,
                "state": state,
            }
        )
        return {"llm_output": "Resumo deterministico"}


def test_in_memory_rag_returns_recent_chunks_and_isolates_projects() -> None:
    rag = InMemoryRag()

    for i in range(10):
        rag.index_text(
            project_id="p1",
            text=f"chunk {i}",
            stage=Stage.INTERVIEW,
            artifact_type=None,
            source_role=MessageRole.USER,
        )
    rag.index_text(
        project_id="p2",
        text="outro projeto",
        stage=Stage.INTERVIEW,
        artifact_type=None,
        source_role=MessageRole.USER,
    )

    assert rag.retrieve_context(project_id="p1", query="", limit=3) == (
        "chunk 7\n\n---\n\nchunk 8\n\n---\n\nchunk 9"
    )
    assert rag.retrieve_context(project_id="p2", query="") == "outro projeto"
    assert rag.retrieve_context(project_id="missing", query="") == ""


def test_repository_lists_artifacts_by_creation_time() -> None:
    repo = InMemoryProjectRepository()
    now = datetime.now(UTC).replace(tzinfo=None)
    project = Project(
        id="p1",
        name="Demo",
        description=None,
        current_stage=Stage.REQUIREMENTS,
        created_at=now,
        updated_at=now,
    )
    older = Artifact(
        id="a1",
        project_id="p1",
        type=ArtifactType.EPIC,
        title="Older",
        content="older",
        stage=Stage.REQUIREMENTS,
        status=ArtifactStatus.GENERATED,
        source_context=None,
        created_at=now - timedelta(minutes=1),
        updated_at=now - timedelta(minutes=1),
    )
    newer = Artifact(
        id="a2",
        project_id="p1",
        type=ArtifactType.USER_STORY,
        title="Newer",
        content="newer",
        stage=Stage.REQUIREMENTS,
        status=ArtifactStatus.GENERATED,
        source_context=None,
        created_at=now,
        updated_at=now,
    )

    repo.save_project(project)
    repo.add_artifact(newer)
    repo.add_artifact(older)

    assert [a.id for a in repo.list_artifacts("p1")] == ["a1", "a2"]


def test_sqlite_repository_persists_projects_messages_and_artifacts(tmp_path) -> None:  # noqa: ANN001
    database_path = tmp_path / "idealize.sqlite3"
    now = datetime.now(UTC).replace(tzinfo=None)
    project = Project(
        id="p1",
        name="Demo",
        description="Persisted",
        current_stage=Stage.INTERVIEW,
        created_at=now,
        updated_at=now,
    )
    message = Message(
        id="m1",
        project_id="p1",
        role=MessageRole.USER,
        content="Uma ideia inicial",
        stage=Stage.INTERVIEW,
        created_at=now,
        metadata={"source": "test"},
    )
    artifact = Artifact(
        id="a1",
        project_id="p1",
        type=ArtifactType.PROBLEM_SOLUTION,
        title="Problema e solução",
        content="conteudo",
        stage=Stage.INTERVIEW,
        status=ArtifactStatus.GENERATED,
        source_context="contexto",
        created_at=now,
        updated_at=now,
        metadata={"trace": {"node": "node_interview"}},
    )

    repo = SqliteProjectRepository(database_path)
    repo.save_project(project)
    repo.add_message(message)
    repo.add_artifact(artifact)

    restored = SqliteProjectRepository(database_path)

    assert restored.get_project("p1") == project
    assert restored.list_projects() == [project]
    assert restored.list_messages("p1") == [message]
    assert restored.list_artifacts("p1") == [artifact]


def test_traceable_document_generator_records_prompt_and_node_trace() -> None:
    orchestrator = FakeOrchestrator()
    generator = TraceableDocumentGenerator(
        orchestrator=orchestrator,
        prompts=StagePromptRegistry(prompts_dir=None),
    )

    title, content = generator.generate(
        project_id="p1",
        artifact_type=ArtifactType.MARKET_ANALYSIS,
        stage=Stage.BUSINESS_CASE,
        context_text="Pacientes faltam por esquecimento.",
        title_override=None,
    )

    assert title == "Market Analysis (business_case)"
    assert "**Prompt Id:** `business_case__market_analysis`" in content
    assert "Pacientes faltam por esquecimento." in content
    assert orchestrator.calls[0]["node"] == "node_business_case"
    prompt = orchestrator.calls[0]["state"]["prompt"]
    assert "business case" in prompt.lower()
    assert "Artifact Type: market_analysis" in prompt
    assert generator.last_trace["prompt_id"] == "business_case__market_analysis"
