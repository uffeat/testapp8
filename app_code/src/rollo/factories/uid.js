import { check_factories } from "rollo/utils/check_factories";
import { create_observed_attributes } from "rollo/utils/create_observed_attributes";
import { attribute } from "rollo/factories/__factories__";

const create_uid = (() => {
  let count = 0;
  return () => {
    return `${count++}`;
  };
})();

/* Factory assigning uid attribute/prop to components. */
export const uid = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([attribute], factories);

  const cls = class UId extends parent {
    static observedAttributes = create_observed_attributes(parent, "uid");
    #uid;

    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback() {
      super.created_callback && super.created_callback();
      this.#uid = create_uid();
      this.attribute.uid = this.#uid;
    }

    attributeChangedCallback(name, previous, current) {
      super.attributeChangedCallback &&
        super.attributeChangedCallback(name, previous, current);
      if (name === "uid") {
        if (this.#uid !== current) {
          console.error(
            `'uid' cannot be changed. Reverting to original value.`
          );
          this.attribute.uid = this.#uid;
        }
      }
    }

    get uid() {
      return this.#uid;
    }
  };
  return cls;
};
