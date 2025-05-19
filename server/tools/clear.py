"""
20250518
"""

from pathlib import Path
import shutil


def clear(target: Path) -> None:
    """Deletes TARGET.

    BUG Does not immediately delete everything...
    But does so after multiple runs."""

    if target.exists() and target.is_dir():
        for item in target.iterdir():
            if item.is_dir():
                # Delete dir and all content
                shutil.rmtree(item)
            else:
                # Delete file
                item.unlink()
