"""
pypress/tools/dst.py
20250522
"""

from pathlib import Path
import shutil

class Dst:
    """Tool for handling files in 'dst'."""

    def clear(self) -> "Dst":
        """Deletes dst.
        BUG Does not immediately delete everything...
        But does so after multiple runs. NOT critical."""
        path = Path.cwd() / "pypress/dst"
        if path.exists() and path.is_dir():
            for item in path.iterdir():
                if item.is_dir():
                    # Delete dir and all content
                    shutil.rmtree(item)
                else:
                    # Delete file
                    item.unlink()
        return self

    def write(self, path: str, content: str) -> "Dst":
        """Writes content to dst."""
        path: Path = Path.cwd() / "pypress/dst" / path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return self