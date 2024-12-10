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
  uid,
} from "rollo/factories/__factories__";
import { Rules } from "rollo/components/utils/rules";

/* TODO 




- watch media, perhaps controlled by flag; perhaps via 'active' state (not event, but via event) 


- compare to chec valid
*/

/* Non-visual web component for controlling CSS media rules of parent component's sheet. */
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
          this.#target = this.parentElement;
          if (!this.#target.rules) {
            throw new Error(`Target does not have rules.`);
          }
          /* Create an add rule without items */
          this.#rule = this.#target.rules.add(`@media {}`);
          /* Apply any media */
          if (this.#pending_media) {
            this.media = this.#pending_media;
          } else {
            console.warn(`'media' not set.`);
          }
          /* Create rules for children to engage with */
          this.#rules = Rules.create(this.#rule);
        } else {
          /* Reset media and make ready for next connection */
          this.#pending_media = this.#media;
          this.media = null;
          /* Delete rule in target */
          this.#target.rules.remove(this.#rule);
          /* Reset */
          this.#rule = null;
          this.#rules = null;
          this.#target = null;
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
      if (this.rule) {
        /* Abort, if no change */
        if (this.#media === media) {
          return;
        }
        /* Remove any previous */
        if (this.#media) {
          this.rule.media.deleteMedium(this.#media);
        }
        /* Add any new */
        if (media) {
          this.rule.media.appendMedium(media);
        }
        /* Sync to attribute */
        this.attribute.media = this.#rule.media.mediaText;
        /* Update private */
        this.#media = media;
      } else {
        this.#pending_media = media;
      }
    }
    #media;
    #pending_media;

    get rule() {
      return this.#rule;
    }
    #rule;

    get rules() {
      return this.#rules;
    }
    #rules;

    get target() {
      return this.#target;
    }
    #target;

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
  uid,
  css_media
);

