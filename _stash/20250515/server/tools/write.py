"""
20250518
"""

from pathlib import Path

ROOT = Path.cwd() / "client"
SRC = "client/src"
OK = f"{SRC}/rollometa"


def write(path: Path, content: str) -> None:
    """Writes content to path."""
    if not isinstance(path, Path):
        path = ROOT / path

    if SRC in str(path) and not OK in str(path):
        raise ValueError(f"Cannot write to {path}.")

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
