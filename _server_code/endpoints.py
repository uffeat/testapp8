"""
20250515
"""

from anvil.server import callable as callable_
from tools.connect import connect


def main():
    """Spins up a local Anvil server that
    - Relaxes cors restrictions
    - Enables 'peek'."""

    wait_forever = connect()

    @callable_
    def cors():
        return False

    @callable_
    def peek(*args):
        print(*args)

    wait_forever()


if __name__ == "__main__":
    main()
