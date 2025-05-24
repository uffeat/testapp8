"""
pypress/main.py
20250522
"""

import datetime as dt
from pathlib import Path
from frontmatter import Frontmatter
from jinja2 import Template
from markdown_it import MarkdownIt
from mdit_py_plugins.footnote import footnote_plugin
from mdit_py_emoji import emoji_plugin
from minify_html import minify

markdown = MarkdownIt().use(footnote_plugin).use(emoji_plugin).enable("table")


SRC = Path.cwd() / "pypress/src"


def main() -> None:
    """Creates ..."""
    paths = [path for path in SRC.glob("**/*.md")]
    ##print('paths: ', paths) ##

    data = [
        {
            "entry": Frontmatter.read_file(path),
            "path": path.relative_to(SRC).with_suffix(".template").as_posix(),
            "created": f"{dt.datetime.fromtimestamp(path.stat().st_mtime):%Y-%m-%d %H:%M}",
        }
        for path in paths
    ]

    data = [
        {
            "template": item["entry"]["attributes"].get("template"),
            "meta": {
                key: value
                for key, value in item["entry"]["attributes"].items()
                if key != "template"
            },
            "content": minify(markdown.render(item["entry"]["body"])),
            **{key: value for key, value in item.items() if key != "entry"},
        }
        for item in data
    ]

    data = [
        {
            "created": item["meta"].get("created", item["created"]),
            **item,
        }
        for item in data
    ]

    """
    Shape:

    """
    shape = [
        {
            "meta": {
                "title": "First Post",
                "description": "A first demo",
                "template": "template.jinja",
                "timestamp": "2025-05-09 17:25",
            },
            "content": "<h1>html from md</h1>",
        },
    ]

    print("data: ", data)  ##


if __name__ == "__main__":
    main()
