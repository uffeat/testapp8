/*
import { Insert } from "@/rollocomponent/tools/insert.js";
20250617
v.1.1
*/

/* */
export class Insert {
  #_ = {};

  constructor(owner) {
    this.#_.owner = owner;
  }

  /* Inserts elements/html fragments 'afterbegin'. Chainable with respect to component. */
  afterbegin(...elements) {
    elements.reverse().forEach((e) => {
      e &&
        this.#_.owner[
          typeof e === "string" ? "insertAdjacentHTML" : "insertAdjacentElement"
        ]("afterbegin", e);
    });
    return this.#_.owner;
  }
  /* Inserts elements/html fragments 'afterend'. Chainable with respect to component. */
  afterend(...elements) {
    elements.reverse().forEach((e) => {
      e &&
        this.#_.owner[
          typeof e === "string" ? "insertAdjacentHTML" : "insertAdjacentElement"
        ]("afterend", e);
    });

    return this.#_.owner;
  }
  /* Inserts elements/html fragments 'beforebegin'. Chainable with respect to component. */
  beforebegin(...elements) {
    elements.forEach((e) => {
      e &&
        this.#_.owner[
          typeof e === "string" ? "insertAdjacentHTML" : "insertAdjacentElement"
        ]("beforebegin", e);
    });
    return this.#_.owner;
  }
  /* Inserts  elements/html fragments 'beforeend'. Chainable with respect to component. */
  beforeend(...elements) {
    elements.forEach((e) => {
      e &&
        this.#_.owner[
          typeof e === "string" ? "insertAdjacentHTML" : "insertAdjacentElement"
        ]("beforeend", e);
    });
    return this.#_.owner;
  }
}
