/*
import { Insert } from "@/rollocomponent/tools/insert.js";
20250604
v.1.0
*/

/* */
export class Insert {
  #_ = {};

  constructor(owner) {
    this.#_.owner = owner;
  }

  /* Inserts elements 'afterbegin'. Chainable with respect to component. */
  afterbegin(...elements) {
    elements
      .reverse()
      .forEach(
        (e) => e && this.#_.owner.insertAdjacentElement("afterbegin", e)
      );
    return this.#_.owner;
  }
  /* Inserts elements 'afterend'. Chainable with respect to component. */
  afterend(...elements) {
    elements
      .reverse()
      .forEach((e) => e && this.#_.owner.insertAdjacentElement("afterend", e));
    return this.#_.owner;
  }
  /* Inserts elements 'beforebegin'. Chainable with respect to component. */
  beforebegin(...elements) {
    elements.forEach(
      (e) => e && this.#_.owner.insertAdjacentElement("beforebegin", e)
    );
    return this.#_.owner;
  }
  /* Inserts elements 'beforeend'. Chainable with respect to component. */
  beforeend(...elements) {
    elements.forEach(
      (e) => e && this.#_.owner.insertAdjacentElement("beforeend", e)
    );
    return this.#_.owner;
  }
}
