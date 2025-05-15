"""
20250515
"""

import datetime as dt
import json
from pathlib import Path
from anvil.server import (
    HttpResponse,
    callable as callable_,
    connect,
    http_endpoint,
    request as http_request,
    wait_forever,
)
from create import main as write


def main():
    """Creates or updates manifest for '/public'."""
    connect(
        (json.loads((Path.cwd() / "secrets.json").read_text(encoding="utf-8"))).get(
            "anvil.uplink.server"
        )
    )

    @http_endpoint("/public", methods=["POST"])
    def public(*args, **kwargs):
        http_response = HttpResponse(status=200)
        http_response.headers["Access-Control-Allow-Origin"] = "*"
        message = write()
        http_response.body = json.dumps({"ok": True, "message": message})
        return http_response

    wait_forever()


if __name__ == "__main__":
    main()
