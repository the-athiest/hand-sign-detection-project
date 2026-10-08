"""
test_api.py  
Tests FastAPI HTTP endpoints /api/health and /api/signs.
"""
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "opencv_version" in data
    print("Health check passed:", data)

def test_signs():
    res = client.get("/api/signs")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 12
    assert len(data["signs"]) >= 12
    sign_names = [s["name"] for s in data["signs"]]
    print("Signs check passed. Supported signs:", sign_names)

if __name__ == "__main__":
    test_health()
    test_signs()
    print("All API endpoint tests passed!") 


