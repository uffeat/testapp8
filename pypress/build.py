"""
pypress/build.py
20250522
"""

import json
from pathlib import Path
import shutil
from frontmatter import Frontmatter
from jinja2 import Template
from markdown_it import MarkdownIt
from mdit_py_plugins.footnote import footnote_plugin
from mdit_py_emoji import emoji_plugin
from minify_html import minify





markdown = MarkdownIt().use(footnote_plugin).use(emoji_plugin).enable("table")

SRC = Path.cwd() / "pypress/content"
DIST = Path.cwd() / "pypress/site"


def clear(target: Path) -> None:
    """Deletes target.
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


def read():
    """."""


def write(path: Path, content: str) -> None:
    """Writes content to path."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def main() -> None:
    """."""
    for path in SRC.glob("*.md"):
        result = Frontmatter.read_file(path)

        result_example = {
            "attributes": {"title": "First Post", "description": "A first demo"},
            "body": "# Hello from First\n\nThis is a static post built with pypress!",
            "frontmatter": '\ntitle: "First Post"\ndescription: "A first demo"\n',
        }

        meta = result["attributes"]
        template = meta.pop("template", None)
        content = markdown.render(result["body"])

        print("meta:", meta)
        print("content:", content)
        print("template:", template)

        print()


if __name__ == "__main__":
    main()
