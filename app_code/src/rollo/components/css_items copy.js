import { camel_to_kebab } from "rollo/utils/case";
import { Component, create } from "rollo/component";
import {
  attribute,
  connected,
  hooks,
  name,
  properties,
  reactive,
  state_to_attribute,
  state_to_native,
  tags,
  uid,
} from "rollo/factories/__factories__";

/* Non-visual web component for controlling CSS declarations of parent component's rule.
Notable features:
- Adds/removes items (CSS declarations) as the component is connected/disconnected.
- Shows items as attributes (can itself be used in other stylesheets!).
- Supports kebab- as well as camel-case.
- Supports CSS var declarations and standard declarations, incl. with `!important`.
- Items can be updated with the standard update method, e.g., 
    my_items.update({backgroundColor: 'yellow'})
- Guards agains redundant updates.
- Items can be made reactive with the '$'-syntax, e.g.,
    my_items.$.$color = 'red'
  not only set the color, but also enables effects to be set up, like:
    my_items.effects.add((data) => {
      console.log('The color is:', my_items.$.$color)
    }, '$color')
- `false` item value removes declaration.
- 'clone' method for creating a component with a copy of items.
- Support hooks and iife's.
*/
const css_items = (parent) => {
  const cls = class CssItems extends parent {
    constructor() {
      super();
    }

    get items() {
      return this.#items.data.current;
    }
    #items = new (class Items extends reactive(class {}) {
      constructor(owner) {
        super();
        this.#owner = owner;
      }

      get owner() {
        return this.#owner;
      }
      #owner;

      update(updates = {}) {
        super.update && super.update(updates);
        return this.owner;
      }
    })(this);

    /* Provides getter/setter interface to items. */
    get style() {
      return this.#style;
    }
    #style = new Proxy(this, {
      get(target, key) {
        return target.items[key];
      },
      set(target, key, value) {
        target.update({ [key]: value });
        return true;
      },
    });

    /* Returns target. */
    get target() {
      return this.$.target;
    }
    /* Sets target and applies/unapplies items. */
    set target(target) {
      this.$.target = target;
    }

    /* Returns component with copy of items. */
    clone() {
      return create(this.tagName.toLowerCase(), this.items);
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
      super.style.display = "none";


      /* Bindable effect to add items to rule */
      const add_items_effect = function (data) {
        const style = this.rule.style;
        for (const [key, { current }] of Object.entries(data)) {
          if (current === false) {
            style.removeProperty(key);
          } else {
            if (current.endsWith("!important")) {
              style.setProperty(
                key,
                value.slice(0, -"!important".length),
                "important"
              );
            } else {
              style.setProperty(key, current);
            }
          }
        }
      };



      /* Add effect to handle target */
      this.effects.add((data) => {
        const current = data.target.current;
        const previous = data.target.previous;
        /* Remove items from any previous target */
        if (previous) {
          if (previous.rule) {
            for (const key of Object.keys(this.items)) {
              previous.rule.style.removeProperty(key);
            }
          }
          /* Remove effect */
          if (previous.tags.add_items_effect) {
            this.#items.effects.remove(previous.tags.add_items_effect);
          }
        }
        /* Add items to any current target */
        if (current) {
          if (!current.rule) {
            throw new Error(`Target does not have a rule.`);
          }
          /* Bind, tag and add effect */
          current.tags.add_items_effect = add_items_effect.bind(current);
          this.#items.effects.add(current.tags.add_items_effect);
        }
      }, "target");

      
      /* Add connect-effect to control target  */
      this.effects.add((data) => {
        if (this.$.connected) {
          this.target = this.parentElement;
        } else {
          this.target = null;
        }
      }, "connected");
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
      /* Update items */
      this.#items.update(Object.fromEntries(
        Object.entries(updates)
          .filter(([key, value]) => this.#is_css(key) && value !== undefined)
          .map(([key, value]) => [
            camel_to_kebab(key.trim()),
            typeof value === "string" ? value.trim() : value,
          ])
      ));
      return this;
    }

    #is_css = (key) => {
      return key.startsWith("--") || key in super.style;
    };
  };

  return cls;
};

Component.author(
  "css-items",
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
  tags,
  uid,
  css_items
);
