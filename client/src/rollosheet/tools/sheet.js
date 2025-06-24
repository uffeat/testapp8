/*
import { Sheet } from "@/rollosheet/tools/sheet.js";
20250616
v.1.0
*/


import { remove } from "@/rollotools/array/remove.js";

export class Sheet extends CSSStyleSheet {
  #_ = {
    targets: new Set(),
  };

  constructor(text, { name } = {}) {
    super();
    this.replaceSync(text);
    this.#_.text = text;

    if (name) {
      this.#_.name = name;
    }
  }

  get name() {
    return this.#_.name;
  }

  get targets() {
    return Object.freeze(Array.from(this.#_.targets.keys()));
  }

  get text() {
    return this.#_.text;
  }

  adopt(target) {
    if (!this.#_.targets.has(target)) {
      this.#_.targets.add(target);
      target.adoptedStyleSheets.push(this);
    }
    return this;
  }

  unadopt(target) {
    if (this.#_.targets.has(target)) {
      this.#_.targets.delete(target);
      remove(target.adoptedStyleSheets, this);
    }
    return this;
  }
}
