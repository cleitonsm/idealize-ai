from idealize_contracts import Stage

"""Linear MVP ordering of stages (must match product flow)."""

STAGE_SEQUENCE: tuple[Stage, ...] = (
    Stage.INITIAL_IDEA,
    Stage.INTERVIEW,
    Stage.BRAINSTORMING,
    Stage.REQUIREMENTS,
    Stage.BUSINESS_CASE,
    Stage.STACK_MODELING,
    Stage.MODELING,
    Stage.REVIEW,
)


def next_stage(current: Stage) -> Stage | None:
    try:
        idx = STAGE_SEQUENCE.index(current)
    except ValueError:
        return None
    if idx + 1 >= len(STAGE_SEQUENCE):
        return None
    return STAGE_SEQUENCE[idx + 1]


def can_advance_to(current: Stage, target: Stage) -> bool:
    nxt = next_stage(current)
    return nxt is not None and nxt == target
