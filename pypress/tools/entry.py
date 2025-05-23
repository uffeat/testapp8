"""
pypress/tools/entry.py
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

class Entry:
    def __init__(self, path: Path):
        """."""
        data: dict = Frontmatter.read_file(path)

        meta: dict = data["attributes"]
        content: str = markdown.render(data.pop("body"))

        template: str = meta.pop("template", None)
        self._timestamp = meta.pop("timestamp", f"{dt.datetime.now():%Y-%m-%d %H:%M}")

        if template:
            template = (Path.cwd() / "pypress/templates" / template).read_text(
                encoding="utf-8"
            )
            html = Template(template).render(content=content, **meta)
        else:
            html = content

        self._html = minify(html)

    @property
    def html(self):
        return self._html

    @property
    def timestamp(self):
        return self._timestamp
