import { Component } from "rollo/component";
import {
  attribute,
  chain,
  connected,
  hooks,
  item_to_attribute,
  item_to_native,
  items,
  name,
  parent,
  properties,
  tags,
  uid,
} from "rollo/factories/__factories__";

/* Non-visual web component for reactive conditional effects. */
const data_effect = (parent) => {
  const cls = class DataEffect extends parent {
    constructor() {
      super();
    }

    /*
    TODO
    - Somehow transfer target's items.current to this.items.current, 
      - perhaps subject to condition?
      - perhaps via effect or condition return values?
    - Show, if condition is active
    - Perhaps data-state and data-effect should be the same component?
    */

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

      /* Check effect */
      if (!this.effect) {
        throw new Error(`'effect' not set.`);
      }

      const effect_wrapper = (current, previous, owner) => {
        current = current.filter(([k, v]) => !(k in owner))
        previous = previous.filter(([k, v]) => !(k in owner))
        

      }

      /* Add effect to set target from live DOM */
      this.effects.add(() => {
        if (this.connected) {
          this.target = this.parentElement;
        } else {
          this.target = null;
        }
      }, "connected");

      /* Add effect to add/remove effect/condition to/from current/previous target */
      this.effects.add((current, previous) => {
        if (previous.target) {
          previous.target.effects.remove(this.effect);
        }
        if (current.target) {
          if (!current.target.effects) {
            throw new Error(`Target does not have effects.`);
          }
          current.target.effects.add(this.effect, this.condition);
        }
      }, "target");
    }

    /* Returns active state. */
    get active() {
      return this.$.active;
    }

    /* Returns condition. */
    get condition() {
      return this.#condition;
    }
    /* Sets condition. */
    set condition(condition) {
      if (this.#condition) {
        throw new Error(`'condition' cannot be changed.`);
      }
      this.#condition = condition;
    }
    #condition

    /* Returns effect. */
    get effect() {
      return this.#effect;
    }
    /* Sets effect. */
    set effect(effect) {
      if (this.#effect) {
        throw new Error(`'effect' cannot be changed.`);
      }
      this.#effect = effect;
    }
    #effect

    /* Returns target state. */
    get target() {
      return this.$.target;
    }
    /* Sets target state. */
    set target(target) {
      this.$.target = target;
    }
  };

  return cls;
};

Component.author(
  "data-effect",
  HTMLElement,
  {},
  attribute,
  chain,
  connected,
  hooks,
  item_to_attribute,
  item_to_native,
  items,
  name,
  parent,
  properties,
  tags,
  uid,
  data_effect
);
