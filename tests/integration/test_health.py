import pytest
from httpx import AsyncClient
from fastapi import status

from app.main import app

@pytest.mark.asyncio
async def test_health_endpoints():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.get("/api/v1/health")
        assert r.status_code == status.HTTP_200_OK
        assert r.json()["status"] == "ok"

        r = await ac.get("/api/v1/health/liveness")
        assert r.status_code == status.HTTP_200_OK

        r = await ac.get("/api/v1/health/readiness")
        assert r.status_code == status.HTTP_200_OK
