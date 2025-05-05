"""
pip install anvil-uplink
20250505
"""

import json
from pathlib import Path
from anvil.server import callable as callable_, connect, wait_forever


def run_server():
    """Spins up a local Anvil server that relaxes cors restrictions and enables
    'peek'."""
    connect(
        (json.loads((Path.cwd() / "secrets.json").read_text(encoding="utf-8"))).get(
            "anvil.uplink.server"
        )
    )

    @callable_
    def cors():
        return False

    @callable_
    def peek(*args):
        print(*args)

    wait_forever()


if __name__ == "__main__":
    run_server()
