import { Component } from "rollo/component";
import {
  attribute,
  connected,
  hooks,
  items,
  name,
  properties,
  uid,
} from "rollo/factories/__factories__";
import { Rules } from "rollo/components/utils/rules";

/* Non-visual web component for controlling CSS media rules of parent component's sheet.


*/
const css_media = (parent) => {
  const cls = class CssMedia extends parent {
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
      /* Effect to control media */
      const media_effect = () => {
        if (this.rule) {
          this.rule.media.mediaText = this.media;
        }
        /* Sync to attribute */
        this.attribute.media = this.media;
      };
      /* Add effect to handle target */
      this.effects.add((changes, previous) => {
        /* Disengage from any previous target */
        if (previous.target) {
          previous.target.rules && previous.target.rules.remove(this.rule);
          /* Reset rule and rules */
          this.#rule = this.#rules = null;
          /* Remove effect to control media */
          this.effects.remove(media_effect);
        }
        /* Engage with any current target */
        if (this.target) {
          if (!this.target.rules) {
            throw new Error(`Target does not have rules.`);
          }
          /* Create an add rule without items */
          this.#rule = this.target.rules.add(`@media`);
          /* Create rules for children to engage with */
          this.#rules = Rules.create(this.#rule);
          /* Warn */
          if (import.meta.env.DEV && !this.media) {
            console.warn(`'media' not set.`);
          }
          /* Add effect to control media */
          this.effects.add(media_effect, "media");
        }
      }, "target");
      /* Add effect to set target from live DOM */
      this.effects.add(() => {
        if (this.connected) {
          this.target = this.parentElement;
        } else {
          this.target = null;
        }
      }, "connected");
    }

    /* Returns rule medium state. */
    get media() {
      return this.$.media;
    }
    /* Sets rule medium state. */
    set media(media) {
      /* Allow media to be provided without enclosing '()' */
      if (media) {
        if (!media.startsWith("(")) {
          media = `(${media}`;
        }
        if (!media.endsWith(")")) {
          media = `${media})`;
        }
      }
      this.$.media = media;
    }

    /* Returns CSS rule. */
    get rule() {
      return this.#rule;
    }
    #rule;

    /* Returns rules controller, if target. */
    get rules() {
      return this.#rules;
    }
    #rules;

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
    }
  };

  return cls;
};

Component.author(
  "css-media",
  HTMLElement,
  {},
  attribute,
  connected,
  hooks,
  items,
  name,
  properties,
  uid,
  css_media
);
