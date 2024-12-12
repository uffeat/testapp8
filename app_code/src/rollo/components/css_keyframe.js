import { camel_to_kebab } from "rollo/utils/case";
import { Component } from "rollo/component";
import {
  attribute,
  connected,
  hooks,
  properties,
  reactive,
  state_to_native,
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

      /* Effect to control items. */
      const items_effect = (data) => {
        const style = this.rule.style;
        for (const [key, { current }] of Object.entries(data)) {
          if (current === false) {
            /* false is a cue to remove */
            style.removeProperty(key);
          } else {
            /* Update rule */
            if (current.endsWith("!important")) {
              style.setProperty(
                key,
                value.slice(0, -"!important".length),
                "important"
              );
            } else {
              style.setProperty(key, current);
            }
          }
          /* Sync to attribute */
          this.attribute[key] = current;
        }
      };

      /* Effect to control frame */
      const frame_effect = (data) => {
        this.rule.keyText = `${this.frame}%`;
        /* Sync to attribute */
        this.attribute.frame = this.frame;
      };

      /* Add effect to handle target */
      this.effects.add((data) => {
        const current = data.target.current;
        const previous = data.target.previous;
        /* Disengage from any previous target */
        if (previous) {
          /* Remove rule from previous target */
          previous.rules && previous.rules.remove(this.rule);
          /* Reset rule */
          this.#rule = null;
          /* Remove effects */
          this.effects.remove(frame_effect);
          this.#items.effects.remove(items_effect);
        }
        /* Engage with any current target */
        if (current) {
          if (!current.rules) {
            throw new Error(`Target does not have rules.`);
          }
          //
          /* Create an add rule without items??????? Perhaps it really should be empty??? */
          /*
          TODO
          Do this from effect?? */
          //
          //
          //
          ////this.#rule = current.rules.add({frame: this.frame, items: this.items,});
          this.#rule = current.rules.add(this.frame);
          //
          //
          //
          /* Add effects */
          this.effects.add(frame_effect, "frame");
          this.#items.effects.add(items_effect);
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
      if (frame === "from") {
        frame = 0;
      } else if (frame === "to") {
        frame = 100;
      }
      if (typeof frame !== "number") {
        throw new Error(`'frame' should be a number. Got: ${frame}`);
      }
      if (frame < 0) {
        throw new Error(`'frame' cannot be negative. Got: ${frame}`);
      } else if (frame > 100) {
        throw new Error(
          `'frame' should be less than or equal to 100. Got: ${frame}`
        );
      }
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
      if (
        ![null, undefined].includes(this.frame) &&
        Object.keys(this.items).length > 0
      ) {
        return `${this.frame}% { ${Object.entries(this.items)
          .map(([key, value]) => `${camel_to_kebab(key)}: ${value};`)
          .join(" ")} }`;
      }
    }

    update(updates = {}) {
      super.update && super.update(updates);

      /*
      TODO
      Allow block declaration (frame and items in one go)
      */

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

  state_to_native,

  uid,
  css_keyframe
);
