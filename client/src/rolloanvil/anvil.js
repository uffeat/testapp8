import origins from "@/rollometa/rolloanvil/origins.json";

/* Util for Anvil-related stuff. */
export const anvil = new (class {
  #URL;
  constructor() {
    if (import.meta.env.VERCEL_ENV === "production") {
      this.#URL = origins.production;
    } else {
      this.#URL = origins.development;
    }
  }

  /* Returns origin of Anvil server. */
  get URL() {
    return this.#URL;
  }

  /* Returns client api controller. */
  get client() {
    /* TODO
    Load iframe lazily */

  }

  /* Returns server api controller. */
  get server() {
    // TODO
  }
})();
