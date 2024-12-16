import { Component } from "rollo/component";
import {
  attribute,
  connected,
  events,
  hooks,
  items,
  name,
  uid,
} from "rollo/factories/__factories__";

/* Non-visual web component for reacting to viewport changes with respect to 
parent's media. Can be used as a state-based alternative to a viewport resize 
observer. */
const css_match = (parent, config, ...factories) => {
  const cls = class CssMatch extends parent {
    constructor() {
      super();
    }

    get match() {
      return this.$.match;
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

      /* Establish effect complex so that changes in any parent's 'media' and 
      changes to the viewport updates the 'match' item */
      new (class {
        constructor(owner) {
          this.#owner = owner;
          owner.effects.add((current, previous) => {
            if (previous.parent) {
              previous.parent.effects.remove(this.media_effect);
            }
            if (current.parent) {
              if (current.parent.tag !== "css-media") {
                throw new Error(
                  `'css-match' components can only have 'css-media' parents. Got: ${current.parent.tag}`
                );
              }
              current.parent.effects.add(this.media_effect, "media");
            } else {
              owner.$.match = undefined;
            }
          }, "parent");
        }
        get owner() {
          return this.#owner;
        }
        #owner;

        on_change = (event) => {
          this.owner.$.match = event.matches;
        };

        media_effect = (current, previous) => {
          if (current.media) {
            const query = window.matchMedia(current.media);
            /* NOTE MediaQueryList change handlers can be called directly with 
            the query passed in. While the change handler then does not receive an event, 
            the query and the usual event both expose a 'matches' (and a 'media') prop. */
            this.on_change(query);
            query.addEventListener("change", this.on_change);
          } else {
            this.owner.$.match = undefined;
          }
        };
      })(this);
    }
  };

  return cls;
};

Component.author(
  "css-match",
  HTMLElement,
  {},
  attribute,
  connected,
  events,
  hooks,
  items,
  name,
  uid,
  css_match
);
