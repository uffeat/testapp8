/* Controller for CSSRuleLists.
Use for composition in objects with access CSSGroupingRule or CSSStyleSheet. */
export class Rules {
  static create = (...args) => {
    return new Rules(...args);
  };
  #owner;

  constructor(owner) {
    if (
      !(owner instanceof CSSGroupingRule) &&
      !(owner instanceof CSSStyleSheet)
    ) {
      throw new Error(`Invalid owner: ${owner}`);
    }
    this.#owner = owner;
  }

  /* Returns owner. */
  get owner() {
    return this.#owner;
  }

  /* Returns css rules list as an arry. */
  get rules() {
    return [...this.owner.cssRules];
  }

  /* Returns length of css rules list. */
  get size() {
    return this.owner.cssRules.length;
  }

  /* Returns a text representation of css rules list.
  Primarily intended as a dev tool. */
  get text() {
    return this.rules.map((rule) => `${rule.cssText}`).join("\n");
  }

  /* Creates, appends and returns rule. */
  add(text) {
    /* Expects text in the format: `<selector>` */
    if (!text.trim().endsWith("}")) {
      text = `${text} {}`;
    }
    const index = this.owner.insertRule(text, this.size);
    return this.owner.cssRules[index];
  }

  /* Returns index of rule; undefined if not found. */
  find(rule) {
    for (const [index, _rule] of this.rules.entries()) {
      if (rule === _rule) {
        return index;
      }
    }
  }

  /* Deletes rule. */
  remove(rule) {
    const index = this.find(rule);
    if (index !== undefined) {
      this.owner.deleteRule(index);
    }
  }
}
