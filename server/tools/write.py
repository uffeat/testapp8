"""
server/tools/write.py
20250518
"""

from pathlib import Path

ROOT = Path.cwd() / "client"



def write(path: Path, content: str) -> None:
    """Writes content to path."""
    if not isinstance(path, Path):
        path = ROOT / path

    # Protect against writes to src other than to src/rollometa.
    # No protection re to public.
    path_text = str(path)
    if "client/src/" in path_text:
        if "/rollometa/" not in path_text:
            raise ValueError(f"Cannot write to {path}.")

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
