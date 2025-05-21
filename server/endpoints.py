"""
server/endpoints.py
20250515
"""

from anvil.server import callable as callable_
from tools.connect import connect


def main():
    """Spins up a local Anvil server that relaxes cors restrictions and 
    enables 'peek'."""

    keep_connection = connect()

    @callable_
    def cors():
        return False

    @callable_
    def peek(*args):
        print(*args)

    keep_connection()


if __name__ == "__main__":
    main()
