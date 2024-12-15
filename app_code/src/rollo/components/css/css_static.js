import { Data } from "rollo/utils/data";
import { camel_to_kebab } from "rollo/utils/case";
import { is_number_text } from "rollo/utils/is_number_text";
import { Component, create } from "rollo/component";
import {
  attribute,
  connected,
  hooks,
  items,
  name,
  observer,
  properties,
  shadow,
  uid,
} from "rollo/factories/__factories__";
import { is_css } from "rollo/components/css/factories/is_css";

/* Non-visual web component for generating static css text from JS.
Notable features:
  - Generates style component in shadow with generated CSS.
  - Supports:
    - Standard rules and CSS var declarations with/without '!important'.
    - Media queries.
    - Keyframes.
  - Fairly extensive validation.
Usage:
- As child to 'css-sheet' component -> sets sheet to generated CSS.
- 'clone' method -> returns style component with generated CSS.
- 'text' prop -> returns generated CSS.
 */
const css_static = (parent, config, ...factories) => {
  const cls = class CssStatic extends parent {
    constructor() {
      super();
    }

    #style_element = create("style");

    /* Returns CSS text. */
    get text() {
      return this.#text;
    }
    #text;

    /* Only available during creation. 
    Called:
    - after constructor
    - before CSS classes
    - before 'update' 
    - before children
    - before 'call'
    - before 'created_callback'
    - before live DOM connection 
    NOTE Any (non-undefined) return value replaces component!
    */
    constructed_callback(config) {
      super.constructed_callback && super.constructed_callback(config);
      /* Build CSS text */
      let text = "";
      const css_updates = Data.create(config).filter(([k, v]) => !(k in this));
      const rule_updates = Data.create();
      const media_updates = Data.create();
      const frames_updates = Data.create();
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
      /* Validate declaration keys */
      rule_updates.forEach(([_, items]) => {
        this.#validate_declaration_keys(items);
      });
      media_updates.forEach(([_, block]) => {
        Data.create(block).forEach(([_, items]) => {
          this.#validate_declaration_keys(items);
        });
      });
      frames_updates.forEach(([_, block]) => {
        Data.create(block).forEach(([_, items]) => {
          this.#validate_declaration_keys(items);
        });
      });

      /* NOTE Media declarations are not explicitly validated. 
      The browser raises an exception, if a media rule cannot be parsed. 
      This, however, does not catch all incorrectly formatted declarations,
      but further validation is not worthwhile. */

      /* Validate frames */
      frames_updates.forEach(([_, block]) => {
        /* NOTE Missing keyframes names are caught by the browser. */
        Data.create(block).forEach(([frame, _]) => {
          if (typeof frame !== "string") {
            throw new Error(`'frame' should be a string. Got: ${frame}`);
          }
          if (!["from", "to"].includes(frame)) {
            if (!frame.endsWith("%")) {
              throw new Error(`'frame' should end with '%'. Got: ${frame}`);
            }
            if (!is_number_text(frame.slice(0, -1))) {
              throw new Error(
                `'frame' should be a %-number string. Got: ${frame}`
              );
            }
          }
        });
      });
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
      this.#text = text;
      this.#style_element.textContent = text;
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
      this.shadowRoot.append(this.#style_element);
      /* Add effect to handle parent */
      this.effects.add((current, previous) => {
        const previous_parent = previous.parent;
        const current_parent = current.parent;
        if (previous_parent) {
          if (previous_parent.tag === "css-sheet") {
            previous_parent.sheet.replaceSync("");
          }
        }
        if (current_parent) {
          if (current_parent.tag === "css-sheet") {
            current_parent.sheet.replaceSync(this.text);
          }
        }
      }, "parent");
    }

    child_added_callback(node) {
      throw new Error(`'css-static' components do not accept children.`);
    }

    /* Creates and returns style component with generated CSS. */
    clone() {
      return create("style", { text: this.text });
    }

    #validate_declaration_keys(items) {
      Data.create(items).forEach(([k, v]) => {
        if (!this.is_css(k)) {
          throw new Error(`Invalid key: ${k}`);
        }
      });
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
  observer,
  properties,
  shadow,
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
