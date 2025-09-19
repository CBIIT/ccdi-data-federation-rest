from fastapi import APIRouter

router = APIRouter()

@router.get("/health", tags=["Health"]) 
async def health():
    return {"status": "ok"}

@router.get("/health/liveness", tags=["Health"]) 
async def liveness():
    return {"status": "alive"}

@router.get("/health/readiness", tags=["Health"]) 
async def readiness():
    # TODO: check Memgraph connectivity later
    return {"status": "ready"}
