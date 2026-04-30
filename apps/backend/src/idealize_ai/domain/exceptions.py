class DomainError(Exception):
    """Base class for domain-level failures."""


class ProjectNotFoundError(DomainError):
    def __init__(self, project_id: str) -> None:
        self.project_id = project_id
        super().__init__(f"Project not found: {project_id}")


class InvalidStageTransitionError(DomainError):
    def __init__(self, *, current: str, target: str) -> None:
        self.current = current
        self.target = target
        super().__init__(f"Invalid stage transition: {current} -> {target}")
