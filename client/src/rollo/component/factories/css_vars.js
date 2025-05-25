/* 
20250404
src/rollo/component/factories/css_vars.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/factories/css_vars.js
import { css_vars } from "rollo/component/factories/css_vars.js";
*/

import { constants } from "@/rollo/component/tools/constants.js";
//const { constants } = await modules.get("@/rollo/component/tools/constants.js");

const { CSS_VAR } = constants;

export const css_vars = (parent, config, ...factories) => {
  return class extends parent {
    static name = "css_vars";

    #__;

    __new__() {
      super.__new__?.();

      const registry = {};

      this.#__ = new Proxy(this, {
        get(target, name) {
          /* Normalize name */
          if (!name.startsWith("--")) {
            name = `--${name}`;
          }
          /* By convention, null signals absence of CSS var */
          if (target.isConnected) {
            const value = getComputedStyle(target)
              .getPropertyValue(name)
              .trim();
            if (!value) return null;
            const priority = target.style.getPropertyPriority(name);
            if (priority) return `${value} !${priority}`;
            return value;
          }
          return name in registry ? registry[name] : null;
          /* NOTE
          - getComputedStyle etc. can only be used, when connected, therefore 
            also use of registry. 
          - Could simplify and only use registry regardless of connection, but
            the "dual retrieval logic" captures CSS vars set directly by other 
            means. */
          /* TODO
          - Consider dropping "dual retrieval logic"; probably reasonable to 
            require that the 'get' only works for vars set with 'set'. */
        },
        set(target, name, value) {
          /* By convention, undefined aborts. Allows use of ternaries and iife's */
          if (value === undefined) return true;
          /* Normalize name */
          if (!name.startsWith("--")) {
            name = `--${name}`;
          }

          const previous = target.__[name];

          /* Abort, if no change */
          if (value === previous) return true;

          /* By convention, null removes */
          if (value === null) {
            target.style.removeProperty(name);
          } else {
            /* Handle priority */
            value = value.trim();
            if (value.endsWith("!important")) {
              target.style.setProperty(
                name,
                value.slice(0, -"!important".length),
                "important"
              );
            } else {
              target.style.setProperty(name, value);
            }
          }
          /* Update registry */
          registry[name] = value;

          /* Notify re CSS var change */
          const detail = Object.freeze({ name: name.slice('__'.length), current: value, previous });
          /* NOTE
            - Stricltly speaking redundant to include name in the name-specific 
              event dispatch, but keeps things simple and consistent. */
          target.send(`__${name}`, { detail });
          target.send("__", { detail });
          return true;
        },
      });
    }

    /* Returns object, from which CSS var can be retrieved/set without '--' prefix. */
    get __() {
      return this.#__;
    }

    /* Updates css vars. Chainable. */
    update(updates = {}) {
      super.update?.(updates);
      Object.entries(updates)
        .filter(([name, value]) => name.startsWith(CSS_VAR))
        .forEach(
          ([name, value]) => (this.__[name.slice(CSS_VAR.length)] = value)
        );
      return this;
    }
  };
};
