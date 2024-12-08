import { camel_to_kebab } from "rollo/utils/case";


export class DataRule extends HTMLElement {
  #rule;
  #selector;
  #sheet;
  constructor(sheet, selector, items) {
    super()
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
      if (!this.#is_css(key)) {
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

  #is_css = (key) => {
    return (key) =>
      typeof key === "string" && (key.startsWith("--") || key in this.style);
  };
}

customElements.define("data-rule", DataRule);

export class DataMediaRule extends DataRule {
  constructor(sheet, selector, items) {
    super(sheet, selector, items)
  }

  update(block = {}) {
    for (const [selector, items] of Object.entries(block)) {
      if (items === undefined) {
        continue;
      }
      new DataRule(this.rule, selector, items);
    }
  }

}

customElements.define("data-media-rule", DataMediaRule);


