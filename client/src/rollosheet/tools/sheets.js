/*
import { Sheets } from "@/rollosheet/tools/sheets.js";
20250616
v.1.0
*/

import { remove } from "@/rollotools/array/remove.js";
import { Sheet } from "@/rollosheet/tools/sheet.js";

export class Sheets {
  #_ = {
    registry: new Set(),
  };

  constructor(owner) {
    this.#_.owner = owner;
  }

  /* */
  get owner() {
    return this.#_.owner;
  }

  /* */
  get sheets() {
    return Object.freeze(Array.from(this.#_.registry.values()));
  }

  /* */
  add(...sheets) {
    sheets.forEach((sheet) => {
      if (!this.has(sheet)) {
        if (sheet instanceof Sheet) {
          sheet.adopt(this.owner);
        } else {
          this.owner.adoptedStyleSheets.push(sheet);
        }
        this.#_.registry.add(sheet);
      }
    });
    return this;
  }

  /* */
  find(name) {
    for (const sheet of this.#_.registry.values()) {
      if (name === sheet.name) {
        return sheet;
      }
    }
  }

  /* */
  has(sheet) {
    return this.#_.registry.has(sheet);
  }

  /* */
  async import(...paths) {
    for (const path of paths) {
      const sheet = await use(
        path.endsWith(".sheet.css") ? path : `${path}.sheet.css`
      );
      sheet.adopt(this.owner);
    }

    return this;
  }

  /* */
  remove(...sheets) {
    sheets.forEach((sheet) => {
      if (this.has(sheet)) {
        if (sheet instanceof Sheet) {
          sheet.unadopt(this.owner);
        } else {
          remove(this.owner.adoptedStyleSheets, sheet);
        }
        this.#_.registry.add(sheet);
      }
    });
    return this;
  }
}
