import { Component } from "rollo/component";
import {
  attribute,
  connected,
  hooks,
  items,
  name,
  properties,
  uid,
} from "rollo/factories/__factories__";
import { rule } from "rollo/components/css/factories/rule";
import { rules } from "rollo/components/css/factories/rules";
import { target } from "rollo/components/css/factories/target";
import { text } from "rollo/components/css/factories/text";

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
      const media_effect = () => {
        if (this.rule) {
          /* Warn */
          if (import.meta.env.DEV && !this.media) {
            console.warn(`'media' not set.`);
          }
          this.rule.media.mediaText = this.media;
        }
        /* Sync to attribute */
        this.attribute.media = this.media;
      };
      /* Add effect to control media_effect */
      this.effects.add((changes, previous) => {
        if (this.rule) {
          this.effects.add(media_effect, "media");
        } else {
          this.effects.remove(media_effect);
        }
      }, "rule");
    }

    /* Returns rule medium state. */
    get media() {
      return this.$.media;
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
      this.$.media = media;
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
  items,
  name,
  properties,
  rule,
  rules,
  target,
  text,
  uid,
  css_media
);
