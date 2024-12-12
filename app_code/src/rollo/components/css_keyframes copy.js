import { camel_to_kebab } from "rollo/utils/case";
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

/* Controller for CSSRuleLists.
Use for composition in objects with access CSSKeyframesRule. */
export class Rules {
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

      /* Add effect to handle target */
      this.effects.add((data) => {
        const current = data.target.current;
        const previous = data.target.previous;
        /* Disengage from any previous target */
        if (previous) {
          previous.rules && previous.rules.remove(this.rule);
          /* Reset rule and rules */
          this.#rule = this.#rules = null;
          
        }
        /* Engage with any current target */
        if (current) {
          if (!current.rules) {
            throw new Error(`Target does not have rules.`);
          }
          /* Create an add rule without items */
          this.#rule = current.rules.add(`@keyframes ${this.name}`);
          /* Create rules for children to engage with */
          this.#rules = Rules.create(this.#rule);
          
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

    /* Returns CSS rule. */
    get rule() {
      return this.#rule;
    }
    #rule;

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
  "css-keyframes",
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
  css_keyframes
);
