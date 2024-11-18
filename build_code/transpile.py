"""Pre-building util for Vite-powered app."""

import datetime as dt
import json
from pathlib import Path
import shutil
from bs4 import BeautifulSoup as bs

timestamp = f"Auto-generated: {dt.datetime.now():%Y-%m-%d %H:%M:%S}"

SOURCE = Path.cwd() / "build_code/src"
TARGET = Path.cwd() / "source_code/app/src/built"


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
def parse_html(name: str, content: str) -> tuple[str, str] | None:
    """Returns js name and js transpiled from htmlx-type assets."""
    name_without_suffix = name[: -len(".html")]

    # NOTE Should be kept aligned with construct_htmlx in assets.js

    if name_without_suffix.endswith(".htmlx"):
        assets = []
        soup = bs(content, "html.parser")

        for element in soup.select("template[name]"):
            export = "" if element.get("export") is None else "export "
            html = json.dumps(element.decode_contents().strip())
            assets.append(f"{export}const {element.attrs['name']} = {html}")

        for element in soup.select("style[name]"):
            export = "" if element.get("export") is None else "export "
            css = json.dumps(element.decode_contents().strip())
            assets.append(
                f"{export}const {element.attrs['name']} = new CSSStyleSheet();{element.attrs['name']}.replaceSync({css});"
            )
        js = ("\n").join(assets)
        script = soup.select_one("script")
        if script:
            js += script.decode_contents().strip()
        return f'{name_without_suffix[:-len(".htmlx")]}', js
    else:
        return
        # NOTE Converting html to js gives no performance benefit in assets.js,
        # but it can be done like this:
        # return f"export default {json.dumps(content)}"


def transpile():
    """Creates built assets."""
    delete_directory(TARGET)
    
    js_names = []
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
        parsed = parser(name, content)
        if not parsed:
            continue
        js_name, js = parsed
        if js_name in js_names:
            raise ValueError(f"Name collision: {js_name}")
        js_names.append(js_name)
        write_to_target(js_name, js)
        
    print(f"Assets built: {len(js_names)}")


if __name__ == "__main__":
    transpile()


"""
EXAMPLE

build_code/src/foo.htmlx.html:

<style name="my_sheet" export>
  h1 {
    color: pink;
  }
</style>

<template name="my_template" export>
  <h1>Hello from template!</h1>
</template>

<template name="my_private_template">
  <h1>Hello from private template!</h1>
</template>

<script>
  document.adoptedStyleSheets.push(my_sheet);

  export function demo(root) {
    root.insertAdjacentHTML("beforeend", my_private_template);
    return root;
  }

  export const foo = "FOO";
</script>

main.js:

await (async () => {
  const root = document.getElementById('root')
  const {demo, foo, my_template} = await import('htmlx/foo')
  demo(root).insertAdjacentHTML('beforeend', my_template)
  root.insertAdjacentText('beforeend', foo)
})()
"""


