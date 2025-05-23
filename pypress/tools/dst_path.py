"""
pypress/tools/dst_path.py
20250522
"""

from pathlib import Path

class DstPath:
    """Tool for creating 'dst' path."""

    def __init__(self, path: Path):
        """."""
        self._path = path

    @property
    def path(self) -> str:
        """Returns dst path."""
        return (
            self._path.relative_to(Path.cwd() / "pypress/src")
            .with_suffix(".template")
            .as_posix()
        )
