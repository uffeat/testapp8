import { Data } from "rollo/utils/data";
import { camel_to_kebab } from "rollo/utils/case";
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
import { is_css } from "rollo/components/css/factories/is_css";
import { sheet } from "rollo/components/css/factories/sheet";

/* Non-visual web component for managing dynamically applied static sheets. */
const css_static = (parent, config, ...factories) => {
  const cls = class CssStatic extends parent {
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
    }

    /* Returns a text representation of the sheet.
    Primarily as a dev tool to check the sheet content. */
    get text() {
      return [...this.sheet.cssRules]
        .map((rule) => `${rule.cssText}`)
        .join("\n");
    }
    /* Sets rules from text. */
    set text(text) {
      this.sheet.replaceSync(text);
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

      let text = ''
      const css_updates = Data.create(updates).filter(([k, v]) => !(k in this));
      const rule_updates = Data.create();

      for (const [key, items] of css_updates.entries) {
        if (key.startsWith("@media")) {
          // TODO
          continue;
        }
        if (key.startsWith("@keyframes")) {
          // TODO
          continue;
        }
        rule_updates.update({[key]: items});
      }

      for (const [selector, items] of rule_updates.entries) {
        /*
        TODO
        - experiment with simpler, more direct conversion to string; JSON? Perhaps keep as-is???
        */
      
        const sheet = new CSSStyleSheet();
        sheet.insertRule(`${selector} {}`);
        const rule = sheet.cssRules[0];
        for (const [key, value] of Data.create(items).entries) {
          /*
          TODO
          This part could dried?
          */
          if (value.endsWith("!important")) {
            rule.style.setProperty(
              key,
              value.slice(0, -"!important".length).trim(),
              "important"
            );
          } else {
            rule.style.setProperty(camel_to_kebab(key), value);
          }
        }
        text += rule.cssText;
      }

      console.log('text:', text)

      this.text = text

      return this;
    }
  };

  return cls;
};

Component.author(
  "css-static",
  HTMLElement,
  {},
  attribute,
  connected,
  hooks,
  items,
  is_css,
  name,
  properties,
  sheet,
  uid,
  css_static
);
