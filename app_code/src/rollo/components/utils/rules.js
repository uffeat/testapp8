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

  /* Creates, appends and returns rule */
  add = (text) => {
    /* Expects text in the format: `<selector> {}` */
    const index = this.#owner.insertRule(text, this.#owner.cssRules.length);
    return this.#owner.cssRules[index];
  };

  /* Returns index of rule; undefined if not found. */
  find = (rule) => {
    for (const [index, _rule] of [...this.#owner.cssRules].entries()) {
      if (rule === _rule) {
        return index
      }
    }
  }

  /* Deletes rule. */
  remove = (rule) => {
    const index = this.find(rule)
    if (index !== undefined) {
      this.#owner.deleteRule(index);
    }


    
  };
}
