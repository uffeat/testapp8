"""
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
    """Spins up a local Anvil server that serves 'types' endpoint."""

    keep_connection = connect()

    @endpoint
    def types(data: dict, submission: int = None) -> dict:
        """Updates src/rollometa/public/__types__.json."""
        types = list(
            set([file.suffix[1:] for file in SOURCE.rglob("*.*") if not file.is_dir()])
        )
        types.sort()
        write(
            f"src/rollometa/public/__types__.json",
            json.dumps(types),
        )
        return dict(ok=True)

    keep_connection()


if __name__ == "__main__":
    main()
