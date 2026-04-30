from __future__ import annotations

import json
import sqlite3
from collections.abc import Iterable
from datetime import datetime
from pathlib import Path
from typing import Any

from idealize_contracts import ArtifactStatus, ArtifactType, MessageRole, Stage

from idealize_ai.domain.entities import Artifact, Message, Project
from idealize_ai.ports.repositories import ProjectRepository


class SqliteProjectRepository(ProjectRepository):
    """SQLite-backed repository for local MVP persistence."""

    def __init__(self, database_path: str | Path) -> None:
        self.database_path = Path(database_path)
        self.database_path.parent.mkdir(parents=True, exist_ok=True)
        self._initialize()

    def save_project(self, project: Project) -> None:
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO projects (
                    id, name, description, current_stage, created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    name = excluded.name,
                    description = excluded.description,
                    current_stage = excluded.current_stage,
                    created_at = excluded.created_at,
                    updated_at = excluded.updated_at
                """,
                (
                    project.id,
                    project.name,
                    project.description,
                    project.current_stage.value,
                    _dump_datetime(project.created_at),
                    _dump_datetime(project.updated_at),
                ),
            )

    def get_project(self, project_id: str) -> Project | None:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT
                    id, name, description, current_stage, created_at, updated_at
                FROM projects
                WHERE id = ?
                """,
                (project_id,),
            ).fetchone()
        return _project_from_row(row) if row else None

    def list_projects(self) -> list[Project]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT
                    id, name, description, current_stage, created_at, updated_at
                FROM projects
                ORDER BY updated_at DESC, created_at DESC
                """
            ).fetchall()
        return [_project_from_row(row) for row in rows]

    def add_message(self, message: Message) -> None:
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO messages (
                    id, project_id, role, content, stage, created_at, metadata
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    project_id = excluded.project_id,
                    role = excluded.role,
                    content = excluded.content,
                    stage = excluded.stage,
                    created_at = excluded.created_at,
                    metadata = excluded.metadata
                """,
                (
                    message.id,
                    message.project_id,
                    message.role.value,
                    message.content,
                    message.stage.value if message.stage else None,
                    _dump_datetime(message.created_at),
                    _dump_json(message.metadata),
                ),
            )

    def list_messages(self, project_id: str) -> list[Message]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT
                    id, project_id, role, content, stage, created_at, metadata
                FROM messages
                WHERE project_id = ?
                ORDER BY created_at ASC
                """,
                (project_id,),
            ).fetchall()
        return [_message_from_row(row) for row in rows]

    def add_artifact(self, artifact: Artifact) -> None:
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO artifacts (
                    id, project_id, type, title, content, stage, status,
                    source_context,
                    created_at, updated_at, metadata
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    project_id = excluded.project_id,
                    type = excluded.type,
                    title = excluded.title,
                    content = excluded.content,
                    stage = excluded.stage,
                    status = excluded.status,
                    source_context = excluded.source_context,
                    created_at = excluded.created_at,
                    updated_at = excluded.updated_at,
                    metadata = excluded.metadata
                """,
                (
                    artifact.id,
                    artifact.project_id,
                    artifact.type.value,
                    artifact.title,
                    artifact.content,
                    artifact.stage.value,
                    artifact.status.value,
                    artifact.source_context,
                    _dump_datetime(artifact.created_at),
                    _dump_datetime(artifact.updated_at),
                    _dump_json(artifact.metadata),
                ),
            )

    def list_artifacts(self, project_id: str) -> list[Artifact]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT
                    id, project_id, type, title, content, stage, status,
                    source_context,
                    created_at, updated_at, metadata
                FROM artifacts
                WHERE project_id = ?
                ORDER BY created_at ASC
                """,
                (project_id,),
            ).fetchall()
        return [_artifact_from_row(row) for row in rows]

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.database_path)
        connection.execute("PRAGMA foreign_keys = ON")
        return connection

    def _initialize(self) -> None:
        statements = [
            """
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                current_stage TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                stage TEXT,
                created_at TEXT NOT NULL,
                metadata TEXT,
                FOREIGN KEY(project_id) REFERENCES projects(id)
                    ON DELETE CASCADE
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS artifacts (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL,
                type TEXT NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                stage TEXT NOT NULL,
                status TEXT NOT NULL,
                source_context TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                metadata TEXT,
                FOREIGN KEY(project_id) REFERENCES projects(id)
                    ON DELETE CASCADE
            )
            """,
        ]
        with self._connect() as connection:
            for statement in statements:
                connection.execute(statement)


def _dump_datetime(value: datetime) -> str:
    return value.isoformat()


def _load_datetime(value: str) -> datetime:
    return datetime.fromisoformat(value)


def _dump_json(value: dict[str, Any] | None) -> str | None:
    if value is None:
        return None
    return json.dumps(value, ensure_ascii=False, sort_keys=True)


def _load_json(value: str | None) -> dict[str, Any] | None:
    if value is None:
        return None
    loaded = json.loads(value)
    return loaded if isinstance(loaded, dict) else None


def _project_from_row(row: Iterable[Any]) -> Project:
    project_id, name, description, current_stage, created_at, updated_at = row
    return Project(
        id=project_id,
        name=name,
        description=description,
        current_stage=Stage(current_stage),
        created_at=_load_datetime(created_at),
        updated_at=_load_datetime(updated_at),
    )


def _message_from_row(row: Iterable[Any]) -> Message:
    message_id, project_id, role, content, stage, created_at, metadata = row
    return Message(
        id=message_id,
        project_id=project_id,
        role=MessageRole(role),
        content=content,
        stage=Stage(stage) if stage else None,
        created_at=_load_datetime(created_at),
        metadata=_load_json(metadata),
    )


def _artifact_from_row(row: Iterable[Any]) -> Artifact:
    (
        artifact_id,
        project_id,
        artifact_type,
        title,
        content,
        stage,
        status,
        source_context,
        created_at,
        updated_at,
        metadata,
    ) = row
    return Artifact(
        id=artifact_id,
        project_id=project_id,
        type=ArtifactType(artifact_type),
        title=title,
        content=content,
        stage=Stage(stage),
        status=ArtifactStatus(status),
        source_context=source_context,
        created_at=_load_datetime(created_at),
        updated_at=_load_datetime(updated_at),
        metadata=_load_json(metadata),
    )
