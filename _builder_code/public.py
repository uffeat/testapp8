"""
20250506
"""

import json
from pathlib import Path

SOURCE = Path.cwd() / "app_code/public"
NAME = "__paths__.json"
TARGETS = [
    "app_code/public",
    "app_code/src/rollovite/tools/public",
]





def main():
    """Creates or updates json registry for '/public'."""
    paths = [f'/{file.relative_to(SOURCE).as_posix()}' for file in SOURCE.rglob("*.*") if file.name != NAME]
    content = json.dumps(paths)

    for target in TARGETS:
        file = Path.cwd() / f'{target}/{NAME}'
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text(content, encoding="utf-8")


if __name__ == "__main__":
    main()
