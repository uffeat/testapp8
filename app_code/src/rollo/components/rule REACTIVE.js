import { Component } from "rollo/component";
import { camel_to_kebab } from "rollo/utils/case";
import { Reactive } from "rollo/factories/reactive";
import {
  attribute,
  connected,
  parent,
  properties,
  reactive,
  uid,
} from "rollo/factories/__factories__";

/* Non-visual web component for dynamic rules. */
const factory = (parent) => {
  const cls = class DataRule extends parent {
    #items;
    #name;
    #rule;
    #selector;
    #sheet;
    constructor(...args) {
      super(...args);
    }

    created_callback(...args) {
      super.created_callback && super.created_callback(...args);
      this.style.display = "none";

      this.effects.add((data) => {
        if (this.$.connected) {
          this.#sheet = this.parent.sheet;
          const index = this.#sheet.insertRule(
            `${this.selector} {}`,
            this.parent.size
          );
          this.#rule = this.#sheet.cssRules[index];

          if (this.#items) {
            for (const [key, value] of Object.entries(this.#items)) {
              if (!(key in this.style)) {
                throw new Error(`Invalid key: ${key}`);
              }
              this.#rule.style.setProperty(camel_to_kebab(key), value);
            }
          }
        } else {
          this.#sheet = null;

          // TODO
        }
      }, "connected");

      /* Show state as attribute */
      this.effects.add((data) => {
        for (let [key, { current, previous }] of Object.entries(data)) {
          key = `state-${key}`;
          if (["boolean", "number", "string"].includes(typeof current)) {
            this.attribute[key] = current;
          } else {
            this.attribute[key] = null;
          }
        }
      });

      /* Add effect to change rule */
      this.effects.add(
        (data) => {
          //console.log(data)////
          // TODO handle important and css vars. Perhaps css vars in separate component

          for (const [key, { current, previous }] of Object.entries(data)) {
            this.#rule.style.setProperty(camel_to_kebab(key), current);
          }
        },
        (data) => {
          ////console.log(data)////
          if (Object.keys(data).length > 0) {
            const key = Object.keys(data)[0];
            ////console.log('key:', key)////
            return key in this.style;
          }
        }
      );
    }

    get items() {
      return this.#items;
    }

    set items(items) {
      this.#items = items;
      /*
      for (const [key, value] of Object.entries(items)) {
        if (!(key in this.style)) {
          throw new Error(`Invalid key: ${key}`)
        }
        this.#rule.style.setProperty(camel_to_kebab(key), value);
      }
        */
    }

    get name() {
      return this.#name;
    }

    /* For dom identification */
    set name(name) {
      this.#name = name;
      this.attribute.name = name;
    }

    get selector() {
      return this.#selector;
    }

    set selector(selector) {
      if (this.#selector) {
        throw new Error(`'selector' is write-once.`);
      }
      this.#selector = selector;
      this.attribute.selector = selector;
    }

    update(updates = {}) {
      super.update && super.update(updates)

      Object.entries(updates).filter(([key, value]) => {
        return key in this.style
      })

      return this
    }
  };

  

  return cls;
};

Component.author(
  "data-rule",
  HTMLElement,
  {},
  attribute,
  connected,
  parent,
  properties,
  reactive,
  uid,
  factory
);
