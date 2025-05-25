"""
server/meta.py
20250520
"""

import json
from pathlib import Path


from tools.connect import connect
from tools.endpoint import endpoint
from tools.write import write

ROOT = Path.cwd() / "client"
SOURCE = ROOT / "public"


def main():
    """Serves 'meta' endpoint."""

    keep_connection = connect()

    @endpoint
    def meta(data: dict, submission: int = None) -> dict:
        """Updates meta files."""

        # Update "src/rollometa/public/__types__.json"
        types = list(
            set([file.suffix[1:] for file in SOURCE.rglob("*.*") if not file.is_dir()])
        )
        types.sort()
        print("types: ", types)  ##
        write(
            f"src/rollometa/public/__types__.json",
            json.dumps(types),
        )

        # Update "/rollotest/batch/__manifest__.json"
        paths = [
            f"/{file.relative_to(SOURCE).as_posix()}"
            for file in (SOURCE / "rollotest/batch").rglob("*.test.js")
        ]
        print("paths: ", paths)  ##
        write(
            (SOURCE / "rollotest/batch/__manifest__.json"),
            json.dumps(paths),
        )

        # Update "/rollotest/vercel/__manifest__.json"
        paths = [
            f"/{file.relative_to(SOURCE).as_posix()}"
            for file in (SOURCE / "rollotest/vercel").rglob("*.test.js")
        ]
        print("paths: ", paths)  ##
        write(
            (SOURCE / "rollotest/vercel/__manifest__.json"),
            json.dumps(paths),
        )

        return dict(ok=True)

    keep_connection()


if __name__ == "__main__":
    main()
