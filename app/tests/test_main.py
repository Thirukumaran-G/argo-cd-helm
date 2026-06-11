from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "GitOps Demo API is running"

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_info():
    response = client.get("/info")
    assert response.status_code == 200
    assert response.json()["app"] == "gitops-demo"

def test_gitops_status():
    response = client.get("/gitops-status")
    assert response.status_code == 200
    assert "stages" in response.json()