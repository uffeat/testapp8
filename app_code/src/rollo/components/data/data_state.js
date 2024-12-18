import { Component } from "rollo/component";
import { Data } from "rollo/types/data";
import { State } from "rollo/factories/state";
import {
  attribute,
  chain,
  connected,
  hooks,
  items,
  name,
  parent,
  properties,
  tags,
  uid,
} from "rollo/factories/__factories__";

/* Non-visual web component for reactive data. Use as a more tangible in-DOM 
alternative to State instances to leverage DOM features, incl. 'data-effect' 
children and options to style based on state mark-up.
NOTE
- While regular components hold a single State instance ('items'), 
  DataState components also hold a second State instance ('state'),
  which is made the "primary" state object, i.e., '$' and 'effects'
  shadow 'state' (and not 'items'). Moreover, when the special '$$'
  syntax is used in 'update', 'state' (and not 'items') is updated.
  In conclusion, 'items' should be used for "standard" component state
  management (and for compatibility with basic factories), while
  'state' should be used for "actual" state management. 
- The factories 'item_to_attribute' and 'item_to_native' are not used,
  since these are of less relevance for 'state'. */
const data_state = (parent) => {
  const cls = class DataState extends parent {
    static PREFIX = "$";
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

      /* Show state as attribute */
      this.state.effects.add((changes) => {
        if (!changes.size) return;
        changes
          .filter(
            ([k, v]) =>
              typeof k === "string" &&
              ["boolean", "number", "string"].includes(typeof v)
          )
          .forEach(([k, v]) => {
            /* By convention and to reduce risk of unintended effects,
            keys that are also props in base proto are prefixed with 'state- */
            if (k in this.__base__.prototype) {
              this.attribute[`state-${k}`] = v;
            } else {
              this.attribute[k] = v;
            }
          });
      });
    }

    /* Handles hooks. Chainable. 
    Called during creation:
    - after CSS classes
    - after children
    - after 'update' 
    - before 'created_callback'
    - before live DOM connection */
    call(...hooks) {
      super.call && super.call(...hooks);
      /* Handle effects */
      hooks
        .filter((hook) => Array.isArray(hook))
        .forEach(([effect, condition]) => {
          this.state.effects.add(effect, condition)
        });
      
      return this
    }

    /* Updates component. Chainable. 
    Called during creation:
    - after CSS classes
    - after children
    - before 'call'
    - before 'created_callback'
    - before live DOM connection */
    update(updates) {
      super.update && super.update(updates);
      /* Update state */
      this.state.update(
        Data.create(updates)
          .filter(
            ([key, value]) =>
              typeof key === "string" && key.startsWith(DataState.PREFIX)
          )
          .map(([key, value]) => [key.slice(DataState.PREFIX.length), value])
      );
      return this;
    }

    /* Provives API for getting/setting single state items. */
    get $() {
      return this.#state.$;
    }

    /* Returns effects controller. */
    get effects() {
      return this.#state.effects;
    }

    /* Returns reactive state instance. */
    get state() {
      return this.#state

    }
    #state = State.create(this)
  };

  return cls;
};

Component.author(
  "data-state",
  HTMLElement,
  {},
  attribute,
  chain,
  connected,
  hooks,
  items,
  name,
  parent,
  properties,
  tags,
  uid,
  data_state
);
