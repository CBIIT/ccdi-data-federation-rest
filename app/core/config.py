from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "CCDI Data Federation REST"
    api_v1_prefix: str = "/api/v1"
    memgraph_uri: str = "bolt://localhost:7687"
    memgraph_user: str = "neo4j"
    memgraph_password: str = "password"
    page_default: int = 1
    per_page_default: int = 100
    per_page_max: int = 1000
    log_level: str = "INFO"

    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache
def get_settings() -> Settings:
    return Settings()
