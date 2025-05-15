"""
20250515
"""

import json

from anvil.server import (
    HttpResponse,
    http_endpoint,
)

from tools.manifest import main as write
from tools.connect import connect


def main():
    """Spins up a local Anvil server that serves 'manifest' endpoint."""

    wait_forever = connect()

    @http_endpoint("/manifest", methods=["POST"])
    def manifest(*args, **kwargs):
        """Creates or updates manifest for '/public'."""
        http_response = HttpResponse(status=200)
        http_response.headers["Access-Control-Allow-Origin"] = "*"
        message = write()
        http_response.body = json.dumps({"ok": True, "message": message})
        return http_response

    wait_forever()


if __name__ == "__main__":
    main()
