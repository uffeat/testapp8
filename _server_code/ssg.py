"""
20250515
"""

import datetime as dt
import json
from pathlib import Path
from anvil.server import (
    HttpResponse,
    http_endpoint,
    request as http_request,
)

from tools.connect import connect

ROOT = Path.cwd() / "app_code"
TARGET = ROOT / "public/__static__"

timestamp = f"{dt.datetime.now():%Y-%m-%d %H:%M:%S}"

# TODO Delete TARGET or stuff in TARGET first


def write(path: str, content: str) -> None:
    """Writes file to TARGET."""
    file = TARGET / path
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(content, encoding="utf-8")


def main():
    """Spins up a local Anvil server that serves 'ssg' endpoint."""
    wait_forever = connect()

    @http_endpoint("/ssg", methods=["POST"])
    def ssg(*args, **kwargs):
        """Writes static files to disk."""
        http_response = HttpResponse(status=200)
        http_response.headers["Access-Control-Allow-Origin"] = "*"

        data: dict = json.loads(http_request.body.get_bytes().decode("utf-8"))

        print("data: ", data)  ##

        for path, content in data.items():
            write(path, content)

        http_response.body = json.dumps({"ok": True})

        return http_response

    wait_forever()


if __name__ == "__main__":
    main()
