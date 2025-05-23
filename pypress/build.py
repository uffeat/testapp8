"""
pypress/build.py
20250522
"""
from tools.entry import Entry
from tools.manifest import Manifest
from tools.dst import Dst
from tools.dst_path import DstPath
from tools.src import Src


def main() -> None:
    """Creates html files from md '11ty-style'."""

    src = Src()
    dst = Dst()
    manifest = Manifest(dst)

    dst.clear()

    for path in src.paths:
        entry = Entry(path)
        dst_path = DstPath(path)
        dst.write(dst_path.path, entry.html)
        manifest.add(dst_path.path, entry.timestamp)

    manifest.write()


if __name__ == "__main__":
    main()
