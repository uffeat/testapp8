import { camel_to_kebab } from "rollo/utils/case";
import { Component } from "rollo/component";
import {
  attribute,
  connected,
  hooks,
  item_to_native,
  items,
  properties,
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
      /* Effect complex to control items. */
      const items = new (class {
        #owner;
        constructor(owner) {
          this.#owner = owner;
        }
        get owner() {
          return this.#owner
        }
        condition = (changes) => {
          return Object.fromEntries(
            Object.entries(changes)
              .filter(
                ([key, value]) =>
                  this.#owner.#is_css(key) && value !== undefined
              )
              .map(([key, value]) => [
                camel_to_kebab(key.trim()),
                typeof value === "string" ? value.trim() : value,
              ])
          );
        };
        effect = (changes) => {
          const style = this.owner.rule.style;
          for (const [key, value] of Object.entries(changes)) {
            if (value === false) {
              /* false is a cue to remove */
              style.removeProperty(key);
            } else {
              /* Update rule */
              if (value.endsWith("!important")) {
                style.setProperty(
                  key,
                  value.slice(0, -"!important".length),
                  "important"
                );
              } else {
                style.setProperty(key, value);
              }
            }
            /* Sync to attribute */
            this.owner.attribute[key] = value;
          }
        };
      })(this);
      /* Effect to control frame */
      const frame_effect = () => {
        this.rule.keyText = `${this.frame}%`;
        /* Sync to attribute */
        this.attribute.frame = this.frame;
      };
      /* Add effect to handle target */
      this.effects.add((changes, previous) => {
        /* Disengage from any previous target */
        if (previous.target) {
          /* Remove rule from previous target */
          previous.target.rules && previous.target.rules.remove(this.rule);
          /* Reset rule */
          this.#rule = null;
          /* Remove effects */
          this.effects.remove(frame_effect);
          this.effects.remove(items.effect);
        }
        /* Engage with any current target */
        if (this.target) {
          if (!this.target.rules) {
            throw new Error(`Target does not have rules.`);
          }
          /* Create an add rule without items? */
          this.#rule = this.target.rules.add(this.frame);
          /* Add effects */
          this.effects.add(frame_effect, "frame");
          this.effects.add(items.effect, items.condition);
        }
      }, "target");
      /* Add effect to set target from live DOM */
      this.effects.add((data) => {
        if (this.connected) {
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
      if (typeof frame === "string") {
        frame = Number(frame);
      }
      if (typeof frame !== "number" || frame !== frame) {
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
      if (this.rule) {
        return this.rule.cssText;
      }
      if (
        ![null, undefined].includes(this.frame) &&
        Object.keys(this.items).length > 0
      ) {
        return `${this.frame}% { ${Object.entries(this.items)
          .map(([key, value]) => `${camel_to_kebab(key)}: ${value};`)
          .join(" ")} }`;
      }
    }

    /* Updates component. Chainable. 
    Called during creation:
    - after CSS classes
    - after children
    - before 'call'
    - before 'created_callback'
    - before live DOM connection */
    update(updates = {}) {
      super.update && super.update(updates);
      /* Allow setting frame and items in one go */
      Object.entries(updates)
        .filter(
          ([key, value]) => !(key in this) && typeof value === "object"
        )
        .map(([key, value]) => ({ frame: key, items: value }))
        .forEach(({ frame, items }) => {
          this.frame = frame;
          this.items.update(items);
        });
      /* Update items */
      this.items.update(updates);

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
  item_to_native,
  items,
  properties,
  uid,
  css_keyframe
);
