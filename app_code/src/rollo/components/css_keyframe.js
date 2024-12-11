import { camel_to_kebab } from "rollo/utils/case";
import { Component } from "rollo/component";
import {
  attribute,
  connected,
  descendants,
  hooks,
  name,
  properties,
  reactive,
  state_to_attribute,
  state_to_native,
  tags,
  uid,
} from "rollo/factories/__factories__";

/* Non-visual web component for ...*/
const css_keyframe = (parent) => {
  const cls = class CssKeyframe extends parent {
    constructor() {
      super();
    }

    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback(config) {
      super.created_callback && super.created_callback(config);
      this.style.display = "none";

      /* Add effect to handle target */
      this.effects.add((data) => {
        const current = data.target.current;
        const previous = data.target.previous;
        /* Disengage from any previous target */
        if (previous) {
          ////previous.rules && previous.rules.remove(this.rule);
        }
        /* Engage with any current target */
        if (current) {
          if (!current.rules) {
            throw new Error(`Target does not have rules.`);
          }
          /* Create an add rule without items */
          this.#rule = current.rules.add(this.text);
        }
      }, "target");
      /* Add effect to set target from live DOM */
      this.effects.add((data) => {
        if (this.$.connected) {
          this.target = this.parentElement;
        } else {
          this.target = null;
        }
      }, "connected");
    }

    /* Returns frame state. */
    get frame() {
      return this.$.frame;
    }
    /* Sets frame state. */
    set frame(frame) {
      this.$.frame = frame;
    }

    /* Returns current items. */
    get items() {
      return this.#items.data.current;
    }
    /* Resets items from object. */
    set items(items) {
      /* Reset all items */
      this.#items.clear();
      /* Add new items */
      this.#items.update(items);
    }
    /* Composition class to reactively control items. */
    #items = new (class Items extends reactive(class {}) {
      constructor(owner) {
        super();
        this.#owner = owner;
      }
      /* Returns owner (the component). */
      get owner() {
        return this.#owner;
      }
      #owner;
      /* Set all items to false values */
      clear() {
        this.update(
          Object.fromEntries(
            Object.entries(this.data.current).map(([key, value]) => [
              key,
              false,
            ])
          )
        );
      }
      /* Updates items. */
      update(updates = {}) {
        super.update(
          Object.fromEntries(
            Object.entries(updates)
              .filter(
                ([key, value]) => this.owner.#is_css(key) && value !== undefined
              )
              .map(([key, value]) => [
                camel_to_kebab(key.trim()),
                typeof value === "string" ? value.trim() : value,
              ])
          )
        );
      }
    })(this);

    /* Returns CSS rule. */
    get rule() {
      return this.#rule;
    }
    #rule;

    /* Returns target state. */
    get target() {
      return this.$.target;
    }
    /* Sets target state. */
    set target(target) {
      this.$.target = target;
    }

    /* Returns text representation of rule. */
    get text() {
      if (![null, undefined].includes(this.frame) && Object.keys(this.items).length > 0) {
        return `${this.frame}% { ${Object.entries(this.items)
          .map(([key, value]) => `${camel_to_kebab(key)}: ${value};`)
          .join(" ")} }`;
      }
    }

    update(updates = {}) {
      super.update && super.update(updates);

      /* Update items */
      this.#items.update(updates);
      

      return this;
    }

    /* Checks if key is a valid CSS key. */
    #is_css = (key) => {
      return key in super.style;
    };
  };

  return cls;
};

Component.author(
  "css-keyframe",
  HTMLElement,
  {},
  attribute,
  connected,
  
  hooks,
  
  properties,
  reactive,
  state_to_attribute,
  state_to_native,
 
  uid,
  css_keyframe
);
