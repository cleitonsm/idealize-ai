from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from idealize_ai.adapters.inbound.http.routes import health, projects
from idealize_ai.adapters.outbound.generation.stub_document_generator import StubDocumentGenerator
from idealize_ai.adapters.outbound.persistence.in_memory_project_repository import (
    InMemoryProjectRepository,
)
from idealize_ai.adapters.outbound.rag.in_memory_rag import InMemoryRag
from idealize_ai.domain.exceptions import InvalidStageTransitionError, ProjectNotFoundError
from idealize_ai.infrastructure.config.settings import get_settings
from idealize_ai.ports.document_generation import DocumentGeneratorPort
from idealize_ai.ports.rag import RagPort
from idealize_ai.ports.repositories import ProjectRepository


def create_app(
    repository: ProjectRepository | None = None,
    rag: RagPort | None = None,
    document_generator: DocumentGeneratorPort | None = None,
) -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="Idealize AI API", version="0.1.0")

    app.state.repository = repository or InMemoryProjectRepository()
    app.state.rag = rag or InMemoryRag()
    app.state.document_generator = document_generator or StubDocumentGenerator()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"] if settings.app_env != "production" else [],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.exception_handler(ProjectNotFoundError)
    async def handle_project_not_found(
        _request: Request,
        exc: ProjectNotFoundError,
    ) -> JSONResponse:
        return JSONResponse(status_code=404, content={"detail": str(exc)})

    @app.exception_handler(InvalidStageTransitionError)
    async def handle_invalid_transition(
        _request: Request,
        exc: InvalidStageTransitionError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=409,
            content={
                "detail": str(exc),
                "current": exc.current,
                "target": exc.target,
            },
        )

    app.include_router(health.router, tags=["health"])
    app.include_router(projects.router, prefix="/projects", tags=["projects"])
    return app
