"""
pip install anvil-uplink
20250519
"""

import json
from anvil import BlobMedia
from anvil.server import HttpResponse, http_endpoint, request as http_request


def endpoint(target: callable):
    """."""

    def wrapper(submission: str=None):
        """."""
        body: BlobMedia = http_request.body
        request_data: dict = json.loads(body.get_bytes().decode("utf-8"))

        response_data: dict = target(request_data, submission=int(submission))
        http_response = HttpResponse(status=200)
        http_response.headers["Access-Control-Allow-Origin"] = "*"
        http_response.body = json.dumps(response_data)
        return http_response

    http_endpoint(f"/{target.__name__}", methods=["POST"])(wrapper)
