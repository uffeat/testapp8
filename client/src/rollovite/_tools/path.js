/*
import { Path } from "@/rollovite/_tools/path.js";
20250526
v.2.0
*/

/* Do NOT import anything from outside 'rollovite' */

/* Utility for parsing path. */
export class Path {
  static create = (arg) => {
    if (arg instanceof Path) {
      return arg;
    }
    return new Path(arg);
  };

  #_ = {};

  constructor(specifier) {
    this.#_.specifier = specifier;
  }

  /* Returns file. */
  get file() {
    this.#init();
    return this.#_.file;
  }

  /* Returns native path. */
  get path() {
    if (this.#_.path === undefined) {
      this.#_.path = this.public
        ? this.specifier
        : `/src/${this.specifier.slice("@/".length)}`;
    }
    return this.#_.path;
  }

  /* Returns public flag. */
  get public() {
    return this.specifier.startsWith("/");
  }

  /* Returns original specifier. */
  get specifier() {
    return this.#_.specifier;
  }

  /* Returns stem. */
  get stem() {
    this.#init();
    return this.#_.stem;
  }

  /* Returns types. */
  get types() {
    this.#init();
    return this.#_.types;
  }

  /* Returns type. */
  get type() {
    if (this.#_.type === undefined) {
      this.#_.type = this.types.split(".").reverse()[0];
    }
    return this.#_.type;
  }

  #init() {
    if (this.#_.init) return;
    this.#_.file = this.specifier.split("/").reverse()[0];
    const [stem, ...hot] = this.#_.file.split(".");
    this.#_.stem = stem;
    this.#_.types = hot.join(".");
    this.#_.init = true;
  }
}
