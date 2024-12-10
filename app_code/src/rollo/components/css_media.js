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


USE MEDIA PROP INSTAD OF FROM/TO (but still use appendMedium, isConnected etc)


- watch media, perhaps controlled by flag; perhaps via state (not event, but via event) 
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
    created_callback() {
      super.created_callback && super.created_callback();
      this.style.display = "none";
      /* */

      /* Add connect-effect to control rule in target sheet */
      this.effects.add((data) => {
        if (this.$.connected) {
          this.#target = this.parentElement;

          if (!this.#target.rules) {
            throw new Error(`Target does not have rules.`);
          }
          /* Create an add rule without items */
          this.#rule = this.#target.rules.add(`@media {}`);

          if (this.from) {
            this.#rule.media.appendMedium(`(${this.from} <= width <= ${this.to})`);
          }
          if (this.to) {
            //this.#rule.media.appendMedium(`(width <= ${this.to})`);
          }



          this.attribute.media = this.#rule.media.mediaText;

          

          this.#rules = Rules.create(this.#rule);
        } else {
          /* XXX Perhaps not necessary? */
          if (this.from) {
            this.#rule.media.deleteMedium(`(width <= ${this.from})`);
          }
          if (this.to) {
            this.#rule.media.deleteMedium(`(${this.to} <= width)`);
          }

          /* Delete rule in target */
          this.#target.rules.remove(this.#rule);
          /* Reset */
          this.#rule = null;
          this.#rules = null;
          this.#target = null;
        }
      }, "connected");
    }

    get from() {
      return this.#from;
    }

    set from(from) {
      if (this.#from === from) {
        return;
      }
      if (this.isConnected) {
        if (this.#from) {
          this.#rule.media.deleteMedium(`(width <= ${this.#from})`);
        }
        if (from) {
          this.#rule.media.appendMedium(`(width <= ${from})`);
        }
        this.attribute.media = this.#rule.media.mediaText;
      }
      this.#from = from;
    }
    #from;

    get to() {
      return this.#to;
    }

    set to(to) {
      if (this.#to === to) {
        return;
      }
      if (this.isConnected) {
        if (this.#to) {
          this.#rule.media.deleteMedium(`(${this.#to} <= width)`);
        }
        if (to) {
          this.#rule.media.appendMedium(`(${to} <= width)`);
        }
        this.attribute.media = this.#rule.media.mediaText;
      }
      this.#to = to;
    }
    #to;

    

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

/* NOTE
For additional control, use MediaList methods (when component is connected), e.g.,
  my_media.rule.media.appendMedium('(height <= 600px)')
  my_media.rule.media.deleteMedium('(height <= 600px)')
If doing this, attributes do not reflect 
 

 */
