"""Smoke test: shared contracts package is installed (editable)."""


def test_idealize_contracts_project_model() -> None:
    from datetime import UTC, datetime

    from idealize_contracts import Project, Stage

    now = datetime.now(UTC).replace(tzinfo=None)
    p = Project(
        id="proj-1",
        name="Demo",
        currentStage=Stage.INITIAL_IDEA,
        createdAt=now,
        updatedAt=now,
    )
    dumped = p.model_dump(by_alias=True, mode="json")
    assert dumped["currentStage"] == "initial_idea"
    assert dumped["name"] == "Demo"
