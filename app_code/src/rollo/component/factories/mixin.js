/* 
20250309
src/rollo/component/factories/mixin.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/mixin.js
import { mixin } from "rollo/component/factories/mixin.js";
*/

const { assign } = await modules.get("@/rollo/tools/assign.js");

/* Special-case factory. */
export const mixin = (parent, config, ...factories) => {
  return class extends parent {
    static name = "mixin";

    /* Assigns members from source classes. */
    assign(...sources) {
      assign(this, ...sources);
      return this;
    }

    /* Applies mixin functions. */
    mixin(options, ...mixins) {
      mixins.forEach((mixin) => mixin(this, options));
      return this;
    }
  };
};

/* NOTE

Example mixin function:

const name = (self, { closures, config, elements } = {}) => {
  self.assign(
    class {
      get name() {
        return elements.input.name;
      }
      set name(name) {
        elements.input.name = name;
        self.attribute.name = name;
      }
    }
  );
};

To fully leverage assign/mixin, the "super_" pattern could be 
implemented in the base class:

#super_;
constructor() {
  super();
  const get_super = (key) => {
    return super[key];
  };

  const set_super = (key, value) => {
    super[key] = value;
  };

  this.#super_ = new Proxy(this, {
    get(target, key) {
      return get_super(key);
    },
    set(target, key, value) {
      set_super(key, value);
      return true;
    },
  });
}

get super_() {
  return this.#super_;
}

Implementation of the "__dict__" pattern in the base class can also be usefull 
in the context of assign/mixin:

#dict;
constructor() {
  super();
  this,#dict = {
    // Place pseudo private filed here
  }
}

get dict() {
  return this.#dict;
}

*/
