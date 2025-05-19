"""
20250518
"""

import datetime as dt
import json
from pathlib import Path
import shutil
from minify_html import minify

##from bs4 import BeautifulSoup as bs
from anvil.server import (
    http_endpoint,
    request as http_request,
)

from tools.connect import connect
from tools.response import create_response

ROOT = Path.cwd() / "client"
TARGET = ROOT / "public/__static__"

timestamp = f"{dt.datetime.now():%Y-%m-%d %H:%M:%S}"


def clear() -> None:
    """Deletes TARGET."""

    # BUG Does not delete everything... But does so after multiple runs.

    if TARGET.exists() and TARGET.is_dir():
        for item in TARGET.iterdir():
            if item.is_dir():
                # Delete dir and all content
                shutil.rmtree(item)
            else:
                # Delete file
                item.unlink()


def write(path: str, content: str) -> None:
    """Writes file to TARGET."""
    file = TARGET / path
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(content, encoding="utf-8")


def main() -> None:
    """Spins up a local Anvil server that serves 'ssg' endpoint."""
    wait_forever = connect()

    clear()

    @http_endpoint("/ssg", methods=["POST"])
    def ssg(*args, **kwargs):
        """Writes static files to disk."""
        data: dict = json.loads(http_request.body.get_bytes().decode("utf-8"))
        ##print("data: ", data)  ##

        # Create html files
        for path, content in data.items():
            write(path, minify(content))

        # Create manifest
        write("__manifest__.json", json.dumps(list(data.keys())))

        return create_response(ok=True)

    wait_forever()


if __name__ == "__main__":
    main()
