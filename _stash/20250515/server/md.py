"""
20250520
"""

import json
from minify_html import minify
from tools.clear import clear
from tools.connect import connect
from tools.endpoint import endpoint
from tools.write import write

SUB = "rollomd"
TARGET = f"public/{SUB}"


def main():
    """Spins up a local Anvil server that serves 'md' endpoint."""

    clear(TARGET)

    keep_connection = connect()

    @endpoint
    def md(data: dict, submission: int = None) -> dict:
        """Writes md-parsed files and manifest to disc."""
        for path, content in data.items():
            write(f"{TARGET}/{path}", minify(content))
        
        write(
            f"{TARGET}/__manifest__.json",
            json.dumps([f"/{SUB}/{path}" for path in data.keys()]),
        )
        return dict(ok=True)

    keep_connection()


if __name__ == "__main__":
    main()
