import json
from anvil import BlobMedia
from anvil.server import request as http_request


def parse_request() -> dict:
    """Returns http response."""
    body: BlobMedia = http_request.body
    data: dict = json.loads(body.get_bytes().decode("utf-8"))
    return data

