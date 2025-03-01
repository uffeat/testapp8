import { List } from "@/rollo/type/types/reactive/list/list";
import { adopt, unadopt } from "@/rollo/sheet/tools/target";

export const sheets = (parent, config, ...factories) => {
  return class extends parent {
    static name = "sheets";

    #effect;
    #root;
    #sheets;

    /* . */
    __new__() {
      super.__new__ && super.__new__();
      this.#sheets = List(null, { owner: this });
      this.#sheets.effects.clear = null;

      this.#effect = (change) => {
        adopt(this.#root, ...change.data.added);
        unadopt(this.#root, ...change.data.removed);
      };
    }

    /* Adopts sheets to current root. */
    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      this.#root = this.getRootNode();
      this.#sheets.effects.add(this.#effect, true);
      /* Alternatively 
      adopt(this.#root, ...this.#sheets.current);
      this.#sheets.effects.add(this.#effect);
      */
    }

    /* Unadopts sheets from previous root */
    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();
      this.#sheets.effects.remove(this.#effect);
      unadopt(this.#root, ...this.#sheets.current);
      this.#root = null;
    }

    get sheets() {
      return this.#sheets;
    }
  };
};

