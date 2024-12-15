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

    /* Returns a text representation of the sheet. */
    get text() {
      /* NOTE For dev -> performance not critical. */
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

      let text = "";
      const css_updates = Data.create(updates).filter(([k, v]) => !(k in this));
      const rule_updates = Data.create();
      const media_updates = Data.create();
      const frames_updates = Data.create();

      /* TODO validate items keys with is_css */

      /* Parse css_updates */
      for (const [key, items] of css_updates.entries) {
        if (key.startsWith("@media")) {
          media_updates.update({ [key]: items });
          continue;
        }
        if (key.startsWith("@keyframes")) {
          frames_updates.update({ [key]: items });
          continue;
        }
        rule_updates.update({ [key]: items });
      }

      /* Convert rule_updates to text */
      for (const [selector, items] of rule_updates.entries) {
        const sheet = new CSSStyleSheet();
        sheet.insertRule(`${selector} {}`);
        const rule = sheet.cssRules[0];
        update_rule(rule, items);
        text += rule.cssText;
      }

      /* Convert media_updates to text */
      for (const [media, block] of media_updates.entries) {
        const sheet = new CSSStyleSheet();
        sheet.insertRule(`${media} {}`);
        const media_rule = sheet.cssRules[0];
        for (const [selector, items] of Data.create(block).entries) {
          media_rule.insertRule(`${selector} {}`);
          const rule = media_rule.cssRules[0];
          update_rule(rule, items);
          text += media_rule.cssText;
        }
      }

      /* Convert frames_updates to text */
      for (const [frames, block] of frames_updates.entries) {
        const sheet = new CSSStyleSheet();
        sheet.insertRule(`${frames} {}`);
        const frames_rule = sheet.cssRules[0];

        for (const [frame, items] of Data.create(block).entries) {
          const text = `${frame} { ${Object.entries(items)
            .map(([k, v]) => `${camel_to_kebab(k)}: ${v};`)
            .join(" ")} }`;
          frames_rule.appendRule(text);
        }
        text += frames_rule.cssText;
      }

      console.log("text:", text);

      this.text = text;

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

function update_rule(rule, items) {
  for (const [key, value] of Data.create(items).entries) {
    if (value.endsWith("!important")) {
      rule.style.setProperty(
        camel_to_kebab(key),
        value.slice(0, -"!important".length).trim(),
        "important"
      );
    } else {
      rule.style.setProperty(camel_to_kebab(key), value);
    }
  }
}
