"""
pypress/tools/src.py
20250522
"""

from pathlib import Path

class Src:
    """Tool for handling files in 'src'."""

    def __init__(self):
        self._paths = (Path.cwd() / "pypress/src").glob("**/*.md")

    @property
    def paths(self):
        """."""
        return self._paths

