/*
import { config } from "@/rolloanvil/config.js";
*/

export const config = new (class {
  #_ = {};
  constructor() {
    this.#_.timeout = new (class {
      get server() {
        return 3000;
      }

      get worker() {
        return 3000;
      }
    })();
  }

  get timeout() {
    return this.#_.timeout
  }
})();
