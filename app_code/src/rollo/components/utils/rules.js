export class Rules {
  static create = (...args) => {
    return new Rules(...args)
  }
  #owner;

  constructor(owner) {
    this.#owner = owner
  }

  /* Creates, appends and returns rule */
  add = (text) => {
    /* Expects text in the format: `selector {}` */

    const index = this.#owner.insertRule(
      text,
      this.#owner.cssRules.length
    );
    return this.#owner.cssRules[index];
  };

  /* */
  remove = (rule) => {
    for (const [index, _rule] of [...this.#owner.cssRules].entries()) {
      if (rule === _rule) {
        this.#owner.deleteRule(index);
        break;
      }
    }
  };
}