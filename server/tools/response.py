import json
from anvil.server import HttpResponse


def create_response(**data) -> HttpResponse:
    """Returns http response."""
    http_response = HttpResponse(status=200)
    http_response.headers["Access-Control-Allow-Origin"] = "*"
    http_response.body = json.dumps(data)
    return http_response

