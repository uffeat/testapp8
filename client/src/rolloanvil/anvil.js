import origins from "@/rollometa/rolloanvil/origins.json";

/* Util for Anvil-related stuff. */
export const anvil = new (class {
  #_ = {}
  constructor() {
    if (import.meta.env.VERCEL_ENV === "production") {
      this.#_.URL = origins.production;
    } else {
      this.#_.URL = origins.development;
    }
  }

  /* Returns origin of Anvil server. */
  get URL() {
    return this.#_.URL;
  }

  /* Returns client api controller. */
  get client() {
    if (!this.#_.client) {
      
    }

  }

  /* Returns server api controller. */
  get server() {
    // TODO
  }
})();
