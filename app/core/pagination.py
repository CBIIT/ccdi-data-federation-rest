from typing import Optional
from urllib.parse import urlencode

from fastapi import HTTPException, status

from .config import get_settings


def validate_pagination(page: Optional[int], per_page: Optional[int]):
    settings = get_settings()
    p = page or settings.page_default
    pp = per_page or settings.per_page_default
    if p < 1 or pp < 1 or pp > settings.per_page_max:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "errors": [
                    {
                        "kind": "InvalidParameters",
                        "parameters": ["page", "per_page"],
                        "reason": "Unable to calculate offset.",
                        "message": "Invalid value for parameters 'page' and 'per_page': unable to calculate offset.",
                    }
                ]
            },
        )
    offset = (p - 1) * pp
    return p, pp, offset


def build_link_header(base_url: str, page: int, per_page: int, total: Optional[int]):
    # If total is unknown, only provide first/prev/next without last.
    links = []
    # First and last (if total known)
    first_q = urlencode({"page": 1, "per_page": per_page})
    links.append(f"<{base_url}?{first_q}>; rel=\"first\"")
    if total is not None:
        last_page = max(1, (total + per_page - 1) // per_page)
        last_q = urlencode({"page": last_page, "per_page": per_page})
        links.append(f"<{base_url}?{last_q}>; rel=\"last\"")
        if page > 1:
            prev_q = urlencode({"page": page - 1, "per_page": per_page})
            links.append(f"<{base_url}?{prev_q}>; rel=\"prev\"")
        if page < last_page:
            next_q = urlencode({"page": page + 1, "per_page": per_page})
            links.append(f"<{base_url}?{next_q}>; rel=\"next\"")
    else:
        # Unknown total: assume we can at least offer prev/next depending on page
        if page > 1:
            prev_q = urlencode({"page": page - 1, "per_page": per_page})
            links.append(f"<{base_url}?{prev_q}>; rel=\"prev\"")
        next_q = urlencode({"page": page + 1, "per_page": per_page})
        links.append(f"<{base_url}?{next_q}>; rel=\"next\"")
    return ", ".join(links)
