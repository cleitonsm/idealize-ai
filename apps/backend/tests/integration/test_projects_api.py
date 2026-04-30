def test_mvp_project_flow(client):  # noqa: ANN001
    r = client.post("/projects", json={"name": "ACME", "description": "Demo"})
    assert r.status_code == 201, r.text
    project = r.json()
    pid = project["id"]
    assert project["name"] == "ACME"
    assert project["currentStage"] == "initial_idea"

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


def test_project_not_found(client):  # noqa: ANN001
    r = client.get("/projects/nonexistent-id")
    assert r.status_code == 404


def test_invalid_stage_transition(client):  # noqa: ANN001
    r = client.post("/projects", json={"name": "X"})
    pid = r.json()["id"]
    bad = "brainstorming"
    r = client.post(f"/projects/{pid}/advance", json={"targetStage": bad})
    assert r.status_code == 409
