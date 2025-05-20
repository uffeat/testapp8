"""
20250515
"""

import json

from anvil.server import (
    HttpResponse,
    http_endpoint,
)

from tools.endpoint import endpoint
from tools.connect import connect


# TODO Refactor to use write
from tools.manifest import main as write






def main():
    """Spins up a local Anvil server that serves 'manifest' endpoint."""

   

    keep_connection = connect()

    @endpoint
    def manifest(data, submission: int = None) -> dict:
        """Creates or updates manifest for '/public'."""
        
        message = write()
        
        
        return dict({"ok": True, "message": message})
        

    keep_connection()


if __name__ == "__main__":
    main()
