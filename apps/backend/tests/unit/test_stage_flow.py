import pytest
from idealize_contracts import Stage

from idealize_ai.domain.stage_flow import STAGE_SEQUENCE, can_advance_to, next_stage


def test_stage_sequence_is_linear() -> None:
    assert STAGE_SEQUENCE[0] == Stage.INITIAL_IDEA
    assert STAGE_SEQUENCE[-1] == Stage.REVIEW


def test_next_stage_advances_one_step() -> None:
    assert next_stage(Stage.INITIAL_IDEA) == Stage.INTERVIEW
    assert next_stage(Stage.REVIEW) is None


@pytest.mark.parametrize(
    ("current", "target", "ok"),
    [
        (Stage.INITIAL_IDEA, Stage.INTERVIEW, True),
        (Stage.INITIAL_IDEA, Stage.BRAINSTORMING, False),
        (Stage.INTERVIEW, Stage.INITIAL_IDEA, False),
    ],
)
def test_can_advance_to(current: Stage, target: Stage, ok: bool) -> None:
    assert can_advance_to(current, target) is ok
