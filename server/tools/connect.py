"""
pip install anvil-uplink
server/tools/connect.py
20250515
"""

import json
from pathlib import Path
from anvil.server import (
    connect as _connect,
    wait_forever,
)


def connect() -> callable:
    """Spins up a local Anvil server."""
    secrets: dict = json.loads(
        (Path.cwd() / "secrets.json").read_text(encoding="utf-8")
    )

    _connect(secrets.get("anvil.uplink.server.development"))

    return wait_forever
