"""
20250518
"""
from pathlib import Path


def write(path: Path, content: str) -> None:
    """Writes content to path."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
