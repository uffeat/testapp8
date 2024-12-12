import { Component } from "rollo/component";
import {
  attribute,
  connected,
  hooks,
  name,
  properties,
  reactive,
  state_to_attribute,
  state_to_native,
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
      const media_effect = (data) => {
        if (this.rule) {
          this.rule.media.mediaText = this.media;
        }
        /* Sync to attribute */
        this.attribute.media = this.media;
      };
      /* Add effect to handle target */
      this.effects.add((data) => {
        const current = data.target.current;
        const previous = data.target.previous;
        /* Disengage from any previous target */
        if (previous) {
          previous.rules && previous.rules.remove(this.rule);
          /* Reset rule and rules */
          this.#rule = this.#rules = null;
          /* Remove effect to control media */
          this.effects.remove(media_effect);
        }
        /* Engage with any current target */
        if (current) {
          if (!current.rules) {
            throw new Error(`Target does not have rules.`);
          }
          /* Create an add rule without items */
          this.#rule = current.rules.add(`@media`);
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
      this.effects.add((data) => {
        if (this.$.connected) {
          this.target = this.parentElement;
        } else {
          this.target = null;
        }
      }, "connected");
    }

    /* Returns rule medium state. */
    get media() {
      return this.$.media
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
      this.$.media = media
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
  name,
  properties,
  reactive,
  state_to_attribute,
  state_to_native,
  uid,
  css_media
);
