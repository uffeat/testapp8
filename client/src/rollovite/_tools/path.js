/*
import { Path } from "@/rollovite/_tools/path.js";
20250525
v.1.0
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

  /* Returns key. 
  - type and first query key combo */
  get key() {
    if (this.#_.key === undefined) {
      this.#_.key = this.#_.querystring
        ? `${this.type}?${this.#_.querystring.split("&")[0]}`
        : this.type;
    }
    return this.#_.key;
  }

  /* Returns native path. */
  get path() {
    if (this.#_.path === undefined) {
      this.#_.path = this.specifier.split("?")[0];
      if (!this.public) {
        this.#_.path = `/src/${this.#_.path.slice("@/".length)}`;
      }
    }
    return this.#_.path;
  }

  /* Returns public flag. */
  get public() {
    return this.specifier.startsWith("/")
  }



  /* Returns query controller. */
  get query() {
    this.#init();
    if (this.#_.query === undefined) {
      const querystring = this.#_.querystring;
      this.#_.query = new (class {
        #_ = {};

        get string() {
          return querystring;
        }

        has(key) {
          if (!this.string) {
            return false;
          }
          if (!this.#_.querykeys) {
            this.#_.querykeys = new Set();
            for (const key of this.string.split("&")) {
              this.#_.querykeys.add(key);
            }
          }
          return this.#_.querykeys.has(key);
        }
      })();
    }

    return this.#_.query;
  }

  /* Returns original specifier. */
  get specifier() {
    return this.#_.specifier;
  }

  /* Returns suffix.
  - Everything after first '.' in file name */
  get suffix() {
    this.#init();
    return this.#_.suffix;
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
    const file = this.specifier.split("/").reverse()[0];
    const [stem, ...hot] = file.split(".");
    this.#_.suffix = hot.join(".");
    const [types, querystring] = this.#_.suffix.split("?");
    this.#_.types = types;
    this.#_.querystring = querystring;
    this.#_.init = true;
  }
}