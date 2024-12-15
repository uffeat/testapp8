import { camel_to_kebab } from "rollo/utils/case";
import { check_factories } from "rollo/utils/check_factories";
import { sheet } from "rollo/factories/__factories__";



const is_css = (() => {
  const web_component = document.createElement("web-component");
  return (key) =>
    typeof key === "string" &&
    (key.startsWith("--") ||
      key.startsWith("@media") ||
      key.startsWith("@keyframes") ||
      key in web_component.style);
})();

class Rule {
  static create = (...args) => {
    return new Rule(...args);
  };
  #rule;
  #selector;
  #sheet;
  constructor(sheet, selector, items) {
    this.#sheet = sheet;
    this.#selector = selector;
    const index = sheet.insertRule(`${selector} {}`, sheet.cssRules.length);
    this.#rule = sheet.cssRules[index];
    if (items) {
      this.update(items);
    }
  }

  get rule() {
    return this.#rule;
  }

  get selector() {
    return this.#selector;
  }

  get sheet() {
    return this.#sheet;
  }

  update(items = {}) {
    for (const [key, value] of Object.entries(items)) {
      if (value === undefined) {
        continue;
      }
      /*
      TODO
      Consider if false should be a cue to delete declaration
      */
      if (!is_css(key)) {
        throw new Error(`Invalid key: ${key}`);
      }
      if (value.endsWith("!important")) {
        this.rule.style.setProperty(
          key,
          value.slice(0, -"!important".length).trim(),
          "important"
        );
      } else {
        this.rule.style.setProperty(camel_to_kebab(key), value);
      }
    }
  }
}

class MediaRule extends Rule {
  constructor(sheet, selector, items) {
    /*TODO 
    auto-insert '@media' if needed
    perhaps extract logic
    
    */
    super(sheet, selector, items);
  }

  update(block = {}) {
    for (const [selector, items] of Object.entries(block)) {
      if (items === undefined) {
        continue;
      }
      /*
      TODO
      Consider if false should be a cue to delete declaration
      */

      //
      //
      new Rule(this.rule, selector, items);
    }
  }
}

class KeyframeRule extends Rule {
  constructor(sheet, selector, items) {
    /* TODO 
    auto-insert '@keyframes' if needed
    Extract name
    */
    super(sheet, selector, items);
  }

  update(block = {}) {
    for (const [selector, items] of Object.entries(block)) {
      if (items === undefined) {
        continue;
      }
      /*
      TODO
      Consider if false should be a cue to delete declaration
      */
      this.rule.style.removeProperty(selector);
      const text = `${key} { ${Object.entries(items)
        .map(([key, value]) => `${camel_to_kebab(key)}: ${value};`)
        .join(" ")} }`;
      this.rule.appendRule(text);
    }
  }
}

/* . */
export const rules = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([sheet], factories);

  const cls = class Rules extends parent {
    /*  */
    update(updates = {}) {
      super.update && super.update(updates); ////

      ////console.log("updates:", updates); ////

      const update_entries = Object.entries(updates);
      //const css_entries = update_entries.filter(([key, value]) => !(key in this))
      
      
      
      const media_entries = update_entries.filter(([key, items]) =>
        key.startsWith("@media")
      );
      media_entries.forEach(([key, items]) => new MediaRule(this.sheet, key, items));



      const keyframes_entries = update_entries.filter(([key, items]) =>
        key.startsWith("@keyframes")
      );


      const standard_css_entries = update_entries.filter(
        ([key, items]) =>
          !(key in this) &&
          !key.startsWith("@media") &&
          !key.startsWith("@keyframes")
      );
      ////console.log("standard_css_entries:", standard_css_entries); ////
      standard_css_entries.forEach(([key, items]) => new Rule(this.sheet, key, items));

      //

      

      const css = Object.fromEntries(
        Object.entries(updates).filter(([key, value]) => !(key in this))
      );
      ////console.log("css:", css); ////

      //const standard = css.filter(([selector, items]) => !selector.startsWith("@media") && !selector.startsWith("@keyframes"))
      // TODO

      for (const [selector, items] of Object.entries(css)) {
        if (selector.startsWith("@media")) {
          ////console.log('items:', items)////
          //new MediaRule(this.sheet, selector, items);
          continue;
        }
        if (selector.startsWith("@keyframes")) {
          new KeyframeRule(this.sheet, selector, items);
          continue;
        }
        ////new Rule(this.sheet, selector, items);
      }

      return this;
    }
  };
  return cls;
};
