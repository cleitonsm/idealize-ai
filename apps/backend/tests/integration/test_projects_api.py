DEMO_ARTIFACTS = [
    ("interview", "problem_solution"),
    ("brainstorming", "value_proposition"),
    ("requirements", "epic"),
    ("requirements", "user_story"),
    ("requirements", "acceptance_criteria"),
    ("business_case", "market_analysis"),
    ("business_case", "business_model"),
    ("modeling", "diagram_mermaid"),
]


def test_mvp_project_flow(client):  # noqa: ANN001
    r = client.post("/projects", json={"name": "ACME", "description": "Demo"})
    assert r.status_code == 201, r.text
    project = r.json()
    pid = project["id"]
    assert project["name"] == "ACME"
    assert project["currentStage"] == "initial_idea"

    r = client.get("/projects")
    assert r.status_code == 200
    assert [p["id"] for p in r.json()] == [pid]

    r = client.post(
        f"/projects/{pid}/idea",
        json={"content": "  Build a thing  "},
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["message"]["content"] == "Build a thing"
    assert body["message"]["projectId"] == pid

    r = client.post(f"/projects/{pid}/advance", json={})
    assert r.status_code == 200, r.text
    assert r.json()["currentStage"] == "interview"

    r = client.post(
        f"/projects/{pid}/artifacts",
        json={"type": "problem_solution"},
    )
    assert r.status_code == 201, r.text
    art = r.json()
    assert art["projectId"] == pid
    assert art["type"] == "problem_solution"
    assert "Project:" in art["content"]
    assert "Prompt Id:" in art["content"]
    assert art["metadata"]["trace"]["node"] == "node_interview"
    assert (
        art["metadata"]["trace"]["prompt_id"] == "interview__problem_solution"
    )
    assert art["metadata"]["rag"]["context_chars"] >= 1

    r = client.get(f"/projects/{pid}/artifacts")
    assert r.status_code == 200
    assert len(r.json()) == 1

    r = client.get(f"/projects/{pid}/history")
    assert r.status_code == 200
    assert len(r.json()) == 1


def test_complete_mvp_validation_flow(client):  # noqa: ANN001
    r = client.post(
        "/projects",
        json={
            "name": "Clinica Conecta",
            "description": "Reduzir faltas e reagendamentos manuais.",
        },
    )
    assert r.status_code == 201, r.text
    pid = r.json()["id"]

    r = client.post(
        f"/projects/{pid}/idea",
        json={
            "content": (
                "Clinicas perdem receita com faltas; a solucao confirma consultas, "
                "reagenda impedimentos e gera indicadores."
            ),
            "metadata": {"source": "demo-script"},
        },
    )
    assert r.status_code == 200, r.text
    assert r.json()["message"]["metadata"]["source"] == "demo-script"

    current_stage = "initial_idea"
    generated = []
    for expected_stage, artifact_type in DEMO_ARTIFACTS:
        while current_stage != expected_stage:
            r = client.post(f"/projects/{pid}/advance", json={})
            assert r.status_code == 200, r.text
            current_stage = r.json()["currentStage"]

        r = client.post(
            f"/projects/{pid}/artifacts",
            json={"type": artifact_type, "title": f"Demo {artifact_type}"},
        )
        assert r.status_code == 201, r.text
        artifact = r.json()
        generated.append(artifact)
        assert artifact["projectId"] == pid
        assert artifact["type"] == artifact_type
        assert artifact["stage"] == expected_stage
        assert artifact["status"] == "generated"
        assert artifact["sourceContext"]
        assert artifact["metadata"]["trace"]["node"] == f"node_{expected_stage}"
        assert artifact["metadata"]["trace"]["prompt_id"] == (
            f"{expected_stage}__{artifact_type}"
        )
        assert artifact["metadata"]["rag"]["context_chars"] > 0

    while current_stage != "review":
        r = client.post(f"/projects/{pid}/advance", json={})
        assert r.status_code == 200, r.text
        current_stage = r.json()["currentStage"]

    r = client.post(f"/projects/{pid}/advance", json={})
    assert r.status_code == 400
    assert r.json()["detail"] == "Project is already in the final stage"

    r = client.get(f"/projects/{pid}/artifacts")
    assert r.status_code == 200
    assert [a["id"] for a in r.json()] == [a["id"] for a in generated]

    r = client.get(f"/projects/{pid}/history")
    assert r.status_code == 200
    assert [m["role"] for m in r.json()] == ["user"]

    r = client.get(f"/projects/{pid}")
    assert r.status_code == 200
    assert r.json()["currentStage"] == "review"


def test_project_not_found(client):  # noqa: ANN001
    r = client.get("/projects/nonexistent-id")
    assert r.status_code == 404

    r = client.get("/projects/nonexistent-id/artifacts")
    assert r.status_code == 404

    r = client.get("/projects/nonexistent-id/history")
    assert r.status_code == 404


def test_invalid_stage_transition(client):  # noqa: ANN001
    r = client.post("/projects", json={"name": "X"})
    pid = r.json()["id"]
    bad = "brainstorming"
    r = client.post(f"/projects/{pid}/advance", json={"targetStage": bad})
    assert r.status_code == 409


def test_http_validation_errors(client):  # noqa: ANN001
    r = client.post("/projects", json={"name": "   "})
    assert r.status_code == 422
    assert r.json()["detail"] == "name must not be empty"

    r = client.post("/projects", json={"name": "X", "unexpected": True})
    assert r.status_code == 422

    r = client.post("/projects", json={"name": "X"})
    pid = r.json()["id"]

    r = client.post(f"/projects/{pid}/idea", json={"content": "   "})
    assert r.status_code == 422
    assert r.json()["detail"] == "content must not be empty"

    r = client.post(f"/projects/{pid}/artifacts", json={"type": "unknown"})
    assert r.status_code == 422
