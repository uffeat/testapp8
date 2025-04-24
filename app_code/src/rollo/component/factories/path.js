/* 
20250302 
src/rollo/component/factories/path.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/path.js
import { path } from "rollo/component/factories/path.js";
*/

export const path = (parent, config, ...factories) => {
  return class extends parent {
    static name = "path";

    get path() {
      return this.getAttribute("path");
    }
    set path(path) {
      if (path) {
        this.setAttribute("path", path);
      } else {
        this.removeAttribute("path");
      }
    }
  };
};
