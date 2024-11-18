"""Pre-building util to be used before creating built with Vite."""

import datetime as dt
import json
from pathlib import Path
import shutil
from bs4 import BeautifulSoup as bs

timestamp = f"Auto-generated: {dt.datetime.now():%Y-%m-%d %H:%M:%S}"


MANIFEST = Path.cwd() / "source_code/app/src/public/assets/manifest.js"
SOURCE = Path.cwd() / "source_code/app/src/public/assets/raw"
TARGET = Path.cwd() / "source_code/app/src/public/assets/built"


def delete_directory(path: Path) -> None:
    """Deletes all directories and files in a given directory."""
    # BUG Fails, if dir contains files that start with '.'. Not sure how to fix?
    if path is SOURCE:
        raise ValueError("src should not be deleted.")
    if path.exists() and path.is_dir():
        for item in path.iterdir():
            if item.is_dir():
                # Delete directory and its content
                shutil.rmtree(item)
            else:
                # Delete file
                item.unlink()
    print(f"Deleted content of '{path.relative_to(Path.cwd())}'")


def read_from_source(file: Path) -> tuple[str, str]:
    """Returns src-relative files name and file content from src asset file."""
    name = f"{file.relative_to(SOURCE).as_posix()}"
    content = file.read_text(encoding="utf-8")
    return name, content


def write_to_target(name: str, content: str) -> None:
    """Adds timestamp and sourceURL to content and and writes it to target."""
    content = f"/* {timestamp} */\n{content}\n//# sourceURL={name}"
    file = TARGET / f"{name}.js"
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(content, encoding="utf-8")


class Parsers:
    """Controller for parsers."""

    def __init__(self):
        self.registry = {}

        super_self = self

        class _Parser:
            """Decorates parser."""

            def __init__(self, *suffixes):
                self.suffixes = suffixes

            def __call__(self, parser):
                super_self.bind(parser, *self.suffixes)

        self._parser = _Parser

    @property
    def parser(self):
        """Decorates parser."""
        return self._parser

    def bind(self, parser: callable, *suffixes) -> None:
        """Registers parser for one or more suffixes."""
        for suffix in suffixes:
            self.registry[suffix] = parser

    def get(self, suffix):
        """Returns parser."""
        return self.registry.get(suffix)


parsers = Parsers()


@parsers.parser("html")
def parse_html(name: str, content: str) -> str:
    """Returns js transpiled from htmlx-type assets."""
    name_without_suffix = name[: -len(".html")]

    # NOTE Does the same job as construct_htmlx in assets.js
    # and should therefore be kept in alignment with that function.

    if name_without_suffix.endswith(".htmlx"):
        assets = []
        soup = bs(content, "html.parser")

        for element in soup.select("template[name]"):
            export = "" if element.get("export") is None else "export "
            name = element.attrs["name"]
            html = json.dumps(element.decode_contents().strip())
            assets.append(f"{export}const {name} = {html}")

        for element in soup.select("style[name]"):
            export = "" if element.get("export") is None else "export "
            name = element.attrs["name"]
            css = json.dumps(element.decode_contents().strip())
            assets.append(
                f"{export}const {name} = new CSSStyleSheet();{name}.replaceSync({css});"
            )
        js = ("\n").join(assets)
        script = soup.select_one("script")
        if script:
            js += script.decode_contents().strip()
        return js

    else:
        return
        # NOTE Converting html to js gives no performance benefit in assets.js,
        # but it can be done like this:
        # return f"export default {json.dumps(content)}"


def transpile():
    """Creates built assets."""
    delete_directory(TARGET)
    manifest = {}
    # Traverse asset src files
    for file in SOURCE.rglob("*.*"):
        name, content = read_from_source(file)
        # Ignore development files
        if " copy" in name:
            continue
        # Ignore test files
        if ".test." in name or "/test/" in name:
            continue
        if name.startswith("test/"):
            continue
        suffix = file.suffix[1:]
        parser = parsers.get(suffix)
        if not parser:
            continue
        js = parser(name, content)
        if not js:
            continue
        write_to_target(name, js)
        manifest[name] = True
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(f"export default {json.dumps(manifest)}", encoding="utf-8")
    print(f"Assets built: {len(manifest)}")


if __name__ == "__main__":
    transpile()


"""
https://testapp8.vercel.app/.well-known/vercel/microfrontend-routing
"""
