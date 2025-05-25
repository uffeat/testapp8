"""
pip install minify-html
server/md.py
20250520
"""

import json
from minify_html import minify
from tools.clear import clear
from tools.connect import connect
from tools.endpoint import endpoint
from tools.write import write

PUBLIC = "public"
DIR = "rollomd"



def main():
    """Spins up a local Anvil server that serves 'md' endpoint."""

    clear(f"{PUBLIC}/{DIR}")

    keep_connection = connect()

    @endpoint
    def md(data: dict, submission: int = None) -> dict:
        """Writes md-parsed files and manifest to disc."""
        for path, content in data.items():
            write(f"{PUBLIC}/{DIR}/{path}", minify(content))
        
        write(
            f"{PUBLIC}/{DIR}/__manifest__.json",
            json.dumps([f"/{DIR}/{path}" for path in data.keys()]),
        )
        return dict(ok=True)

    keep_connection()


if __name__ == "__main__":
    main()
