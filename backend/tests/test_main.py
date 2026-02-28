import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to LifeVault AI API"}

def test_auth_endpoints_exist():
    # Registration check (won't actually call Supabase without keys)
    # We just check the endpoint is reachable
    response = client.post("/api/auth/register", json={"email": "test@example.com", "password": "password"})
    # Status might be 400 or 401 due to missing keys, but shouldn't be 404
    assert response.status_code != 404

def test_memories_protected():
    response = client.get("/api/memories/")
    assert response.status_code == 401 # Should require JWT
