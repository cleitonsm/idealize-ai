from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from idealize_ai.adapters.inbound.http.routes import health
from idealize_ai.infrastructure.config.settings import get_settings


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="Idealize AI API", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"] if settings.app_env != "production" else [],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router, tags=["health"])
    return app
