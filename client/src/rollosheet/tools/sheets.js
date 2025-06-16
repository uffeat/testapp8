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

  get sheets() {

  }

  add(...sheets) {
    sheets.forEach((sheet) => {
      if (!this.#_.registry.has(sheet)) {
        if (sheet instanceof Sheet) {
          sheet.adopt(this.#_.owner);
        } else {
          this.#_.owner.adoptedStyleSheets.push(sheet);
        }
        this.#_.registry.add(sheet);
      }
    });
    return this;
  }

  remove(...sheets) {
    sheets.forEach((sheet) => {
      if (this.#_.registry.has(sheet)) {
        if (sheet instanceof Sheet) {
          sheet.unadopt(this.#_.owner);
        } else {
          remove(this.#_.owner.adoptedStyleSheets, sheet);
        }
        this.#_.registry.add(sheet);
      }
    });
    return this;
  }
}
