"""
20250518
"""

from pathlib import Path
import shutil

ROOT = Path.cwd() / "client"
SRC = "client/src"


def clear(target: Path) -> None:
    """Deletes target.

    BUG Does not immediately delete everything...
    But does so after multiple runs."""

    if not isinstance(target, Path):
        target = ROOT / target

    if SRC in str(target):
        raise ValueError(f"Cannot clear {target}.")

    if target.exists() and target.is_dir():
        for item in target.iterdir():
            if item.is_dir():
                # Delete dir and all content
                shutil.rmtree(item)
            else:
                # Delete file
                item.unlink()
