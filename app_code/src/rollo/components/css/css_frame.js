
import { Component } from "rollo/component";
import {
  attribute,
  connected,
  hooks,
  item_to_native,
  items,
  name,
  properties,
  uid,
} from "rollo/factories/__factories__";
import { is_css } from "rollo/components/css/factories/is_css";
import { items_to_rules } from "rollo/components/css/factories/items_to_rules";
import { rule } from "rollo/components/css/factories/rule";
import { target } from "rollo/components/css/factories/target";

/* Non-visual web component for ...*/
const css_frame = (parent, config, ...factories) => {
  const cls = class CssFrame extends parent {
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
    created_callback() {
      super.created_callback && super.created_callback();
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

    /* Returns CSS rule state. */
    get rule() {
      return this.$.rule;
    }
    /* Resets items and optionally frame from object. */
    set rule(rule) {
      /* Reset all items */
      this.items.update(
        Object.fromEntries(
          Object.entries(this.items.current)
            .filter(([key, value]) => this.is_css(key))
            .map(([key, value]) => [key, false])
        )
      );
      /* Update items and optionally frame */
      this.update(rule);
    }

    /* Returns text representation of rule. */
    get text() {
      if (this.rule) {
        return this.rule.cssText;
      }
      /* NOTE For dev -> performance not critical. */
      if (
        ![null, undefined].includes(this.frame) &&
        Object.keys(this.items.current).length
      ) {
        return `${this.frame}% { ${Object.entries(this.items.current)
          .filter(([key, value]) => this.is_css(key))
          .map(([key, value]) => `${key}: ${value};`)
          .join(" ")} }`;
      }
    }

    /* TODO
    - 'clone' as in css_rule???
    */

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
  "css-frame",
  HTMLElement,
  {},
  attribute,
  connected,
  hooks,
  is_css,
  item_to_native,
  items,
  items_to_rules,
  name,
  properties,
  rule,
  target,
  uid,
  css_frame
);
