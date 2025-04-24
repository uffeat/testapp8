/* 
20250303
src/rollo/sheet/tools/sheets.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/tools/sheets.js
import { Sheets, SheetsType } from "rollo/sheet/tools/sheets.js";
const { Sheets, SheetsType } = await import("rollo/sheet/tools/sheets.js");
*/

import { adopt, unadopt } from "@/rollo/sheet/tools/target.js";

/* Returns SheetType instance. */
export function Sheets(target) {
  return new SheetsType(target);
}

/* Controller for managing sheets for a given target. */
export class SheetsType {
  #registry = new Set();
  #target;
  constructor(target) {
    this.#target = target;
  }

  add(...sheets) {
    for (const sheet of sheets) {
      if (!this.#registry.has(sheet)) {
        this.#registry.add(sheet);
        adopt(this.#target, sheet);
      }
    }
    return this;
  }

  disable(...sheets) {
    for (const sheet of sheets) {
      if (this.#registry.has(sheet)) {
        if (!sheet.disabled) {
          sheet.disabled = true;
        }
      }
    }
    return this;
  }

  enable(...sheets) {
    for (const sheet of sheets) {
      if (!this.#registry.has(sheet)) {
        this.add(sheet);
      }
      if (sheet.disabled) {
        sheet.disabled = false;
      }
    }
    return this;
  }

  remove(...sheets) {
    for (const sheet of sheets) {
      if (this.#registry.has(sheet)) {
        this.#registry.delete(sheet);
        unadopt(this.#target, sheet);
      }
    }
    return this;
  }
}
