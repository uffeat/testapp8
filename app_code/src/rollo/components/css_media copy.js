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
import { Rules } from "rollo/components/utils/rules";

/* Non-visual web component for controlling CSS media rules of parent component's sheet.


TODO
Mention state_to_native re media


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
      /* Add connect-effect to control rule in target sheet */
      this.effects.add((data) => {
        if (this.$.connected) {
          this.target = this.parentElement;
        } else {
          this.target = null;
        }
      }, "connected");
    }

    /* Returns rule medium. */
    get media() {
      return this.#media;
    }
    /* Sets rule medium. */
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
      /* Abort, if no change */
      if (this.#media === media) {
        return;
      }
      /* Sync to attribute */
      this.attribute.media = media;
      /* Update private */
      this.#media = media;
      if (this.rule) {
        this.rule.media.mediaText = media;
      }
    }
    #media;

    /* Returns rule. */
    get rule() {
      return this.#rule;
    }
    #rule;
    
    /* Returns rules controller. */
    get rules() {
      return this.#rules;
    }
    #rules;

    /* Returns target. */
    get target() {
      return this.#target;
    }
    /* Sets target, rule and rules. */
    set target(target) {
      /* Abort, if no change */
      if (this.#target === target) {
        return;
      }
      /* Unravel from old target */
      if (this.#target) {
        this.#target.rules && this.#target.rules.remove(this.rule);
      }
      /* Reset rule and rules */
      this.#rule = this.#rules = null;
      /* Handle new target */
      if (target) {
        if (!target.rules) {
          throw new Error(`Target does not have rules.`);
        }
        /* Create an add rule without items */
        this.#rule = target.rules.add(`@media`);
        /* Apply any media */
        if (this.media) {
          this.#rule.media.mediaText = this.media;
          /* Create rules for children to engage with */
          this.#rules = Rules.create(this.#rule);
        } else {
          import.meta.env.DEV && console.warn(`'media' not set.`);
        }
      }
      this.#target = target;
    }
    #target;

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
  descendants,
  hooks,
  name,
  properties,
  reactive,
  state_to_attribute,
  state_to_native,
  tags,
  uid,
  css_media
);
