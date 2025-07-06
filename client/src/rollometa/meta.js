/*
import { meta } from "@/rollometa/meta.js";
*/

export const meta = new (class {
  #_ = {};

  constructor() {
    this.#_.env = new (class {
      #_ = {};

      constructor() {
        this.#_.DEV = location.origin.startsWith("http://localhost:");

        if (this.#_.DEV) {
          this.#_.name = "development";
        } else {
          if (location.origin === "https://testapp8.vercel.app") {
            this.#_.name = "production";
          } else {
            this.#_.name = "preview";
          }
        }
      }

      get DEV() {
        return this.#_.DEV;
      }

      get name() {
        return this.#_.name;
      }

      get origin() {
        return location.origin;
      }
    })();
  }

  get env() {
    return this.#_.env;
  }
})();
