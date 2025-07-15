/*
import { origins } from "@/rolloanvil/origins.js";
*/

export const origins = new (class {
  get development() {
    return "https://testapp8dev.anvil.app";
  }

  get production() {
    return "https://testapp8.anvil.app";
  }
})();
