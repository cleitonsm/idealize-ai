import os
import sys
from collections.abc import Generator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# Ensure `src` is on path when tests are collected from any cwd
_ROOT = Path(__file__).resolve().parents[1]
_SRC = _ROOT / "src"
if str(_SRC) not in sys.path:
    sys.path.insert(0, str(_SRC))

os.environ.setdefault("APP_ENV", "test")


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    from idealize_ai.adapters.inbound.http.app import create_app
    from idealize_ai.adapters.outbound.persistence.in_memory_project_repository import (
        InMemoryProjectRepository,
    )
    from idealize_ai.adapters.outbound.rag.in_memory_rag import InMemoryRag

    app = create_app(repository=InMemoryProjectRepository(), rag=InMemoryRag())
    with TestClient(app) as test_client:
        yield test_client
