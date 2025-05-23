"""
pypress/tools/manifest.py
20250522
"""

import json
from .dst import Dst

class Manifest:
    """Tool for handling manifest data."""

    def __init__(self, dst: Dst):
        self._dst = dst
        self._index = []

    def add(self, path: str, timestamp: str) -> "Manifest":
        """."""
        self._index.append([timestamp, path])
        return self

    def write(self) -> "Manifest":
        """."""
        self._index.sort(key=lambda key: key[0])
        self._index = [item[1] for item in self._index]
        self._dst.write("manifest/index.json", json.dumps(self._index))
        return self