"""
20250518
"""

import json
from pathlib import Path
from minify_html import minify
##from bs4 import BeautifulSoup as bs
from tools.clear import clear
from tools.connect import connect
from tools.endpoint import endpoint
from tools.write import write


ROOT = Path.cwd() / "client"
TARGET = ROOT / "public/__static__"







def main():
    """Spins up a local Anvil server that serves 'md' endpoint."""
    clear(TARGET)

    keep_connection = connect()

    @endpoint
    def md(data, submission: int = None) -> dict:
        """Writes static files to disk."""
    
        print("Request data: ", data)  ##
        # Create html files
        for path, content in data.items():
            write((TARGET / path), minify(content))
        # Create manifest
        write((TARGET / "__manifest__.json"), json.dumps(list(data.keys())))

        return dict(ok=True)
        

    keep_connection()


if __name__ == "__main__":
    main()

