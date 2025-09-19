from fastapi import FastAPI
from .core.config import get_settings
from .api.v1.routes import health

settings = get_settings()

app = FastAPI(title=settings.app_name, openapi_url=f"{settings.api_v1_prefix}/openapi.json")

# Include health routes
app.include_router(health.router, prefix=settings.api_v1_prefix)

@app.get("/", tags=["Root"]) 
async def root():
    return {"message": "CCDI Data Federation REST API"}
