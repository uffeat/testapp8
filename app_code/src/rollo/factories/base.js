import { constants } from "rollo/constants";
import { check_factories } from "rollo/utils/check_factories";
import { attribute, css_classes, reactive } from "rollo/factories/__factories__";

/* Factory that coordinates multipe other factories, adds reactive features
ans exposes super for external access. also ensure super call in constructor. */
export const base = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([attribute, css_classes, reactive], factories);

  const cls = class Base extends parent {
    constructor() {
      super();
    }

    created_callback(...args) {
      super.created_callback && super.created_callback(...args);

      /* Identify as web component. */
      this.attribute.webComponent = true;

      /* Append children */
      this.append(
        ...args.filter(
          (arg) =>
            arg instanceof HTMLElement ||
            typeof arg === "number" ||
            (typeof arg === "string" && !arg.startsWith(constants.CSS_CLASS))
        )
      );

      /* Show state as attribute */
      this.effects.add((data) => {
        for (let [key, { current, previous }] of Object.entries(data)) {
          if (key.startsWith(constants.NATIVE)) {
            continue;
          }
          key = `state-${key}`;
          if (["boolean", "number", "string"].includes(typeof current)) {
            this.attribute[key] = current;
          } else {
            this.attribute[key] = null;
          }
        }
      });

      /* Set up automatic prop updates from NATIVE-prefixed state */
      this.effects.add((data) => {
        const updates = {};
        for (const [key, { current, previous }] of Object.entries(data)) {
          if (key && key.startsWith(constants.NATIVE)) {
            updates[key.slice(constants.NATIVE.length)] = current;
          }
        }
        this.update(updates);
      });
    }

    /* Provides external access to super. */
    get __super__() {
      return this.#__super__;
    }
    #__super__ = new Proxy(this, {
      get: (target, key) => {
        return super[key];
      },
      set: (target, key, value) => {
        super[key] = value;
        return true;
      },
    });

    

    

    
  };
  return cls;
};
