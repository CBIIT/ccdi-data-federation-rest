from pydantic import BaseModel
from typing import List, Optional, Any

class ErrorItem(BaseModel):
    kind: str
    message: str
    reason: Optional[str] = None
    parameters: Optional[List[str]] = None
    entity: Optional[str] = None
    field: Optional[str] = None

class ErrorEnvelope(BaseModel):
    errors: List[ErrorItem]


def error_invalid_pagination():
    return ErrorEnvelope(errors=[ErrorItem(
        kind="InvalidParameters",
        parameters=["page", "per_page"],
        reason="Unable to calculate offset.",
        message="Invalid value for parameters 'page' and 'per_page': unable to calculate offset."
    )])
