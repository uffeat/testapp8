import { Component } from "rollo/component";
import {
  attribute,
  connected,
  hooks,
  item_to_attribute,
  item_to_native,
  items,
  name,
  properties,
  uid,
} from "rollo/factories/__factories__";
import { rule } from "rollo/components/css/factories/rule";
import { target } from "rollo/components/css/factories/target";
import { text } from "rollo/components/css/factories/text";

/* Non-visual web component for controlling CSS media rules of parent component's sheet.


*/
const css_keyframes = (parent) => {
  const cls = class CssKeyframes extends parent {
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

      /* Add effect to control rules */
      this.effects.add((changes, previous) => {
        if (this.rule) {
          /* Create rules for children to engage with */
          this.$.rules = Rules.create(this.rule);
        } else {
          this.$.rules = null;
        }
      }, "rule");

      
    }

    

    /* Return rules controller. */
    get rules() {
      return this.$.rules;
    }

    
  };

  return cls;
};

Component.author(
  "css-keyframes",
  HTMLElement,
  {},
  attribute,
  connected,
  hooks,
  item_to_attribute,
  item_to_native,
  items,
  name,
  properties,
  rule,
  target,
  text,
  uid,
  css_keyframes
);

/* Controller for CSSRuleLists.
Use for composition in objects with access CSSKeyframesRule. */
class Rules {
  static create = (...args) => {
    return new Rules(...args);
  };
  #owner;

  constructor(owner) {
    if (!(owner instanceof CSSKeyframesRule)) {
      throw new Error(`Invalid owner: ${owner}`);
    }
    this.#owner = owner;
  }

  /* Returns owner. */
  get owner() {
    return this.#owner;
  }

  /* Returns css rules list as an array. */
  get rules() {
    return [...this.owner.cssRules];
  }

  /* Returns length of css rules list. */
  get size() {
    return this.owner.cssRules.length;
  }

  /* Creates, appends and returns rule without items. */
  add(frame) {
    this.owner.appendRule(`${frame}% {}`);
    return this.owner.findRule(`${frame}%`);
  }

  /* Deletes rule. */
  remove(rule) {
    const key_text = rule.keyText;
    for (const rule of this.rules) {
      if (rule.keyText === key_text) {
        this.owner.deleteRule(key_text);
      }
    }
  }
}
