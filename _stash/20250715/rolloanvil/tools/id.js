/*
import { Id } from "@/rolloanvil/tools/id.js";
*/

export const Id = new (class {
  #_ = {
    count: 0,
  };

  create() {
    return `anvil-${this.#_.count++}`;
  }
})();