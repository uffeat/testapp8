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
import { items_to_rules } from "rollo/components/css/factories/items_to_rules";
import { rule } from "rollo/components/css/factories/rule";
import { target } from "rollo/components/css/factories/target";

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

      



      /* Effect to control frame */
      const frame_effect = () => {
        this.rule.keyText = `${this.frame}%`;
        /* Sync to attribute */
        this.attribute.frame = this.frame;
      };

      /* Add effect to control frame effect */
      this.effects.add((changes, previous) => {
        if (this.rule) {
          this.effects.add(frame_effect, "frame");
        } else {
          this.effects.remove(frame_effect);
        }
      }, "rule");

      
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
        .filter(([key, value]) => !(key in this) && typeof value === "object")
        .map(([key, value]) => ({ frame: key, items: value }))
        .forEach(({ frame, items }) => {
          this.frame = frame;
          this.items.update(items);
        });
      
      return this;
    }

    
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
  items_to_rules,
  properties,
  rule,
  target,
  uid,
  css_keyframe
);
