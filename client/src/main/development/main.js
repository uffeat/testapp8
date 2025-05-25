/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

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

    const file = specifier.split("/").reverse()[0];
    const [stem, ...hot] = file.split(".");
    this.#_.suffix = hot.join(".");
    const [types, querystring] = this.#_.suffix.split("?");
    this.#_.types = types;
    this.#_.querystring = querystring;
  }

  /* Returns key. */
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
      this.#_.path = 42; ////
    }
    return this.#_.path;
  }

  /* Returns . */
  get query() {
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

  /* Returns suffix. */
  get suffix() {
    return this.#_.suffix;
  }

  /* Returns types. */
  get types() {
    return this.#_.types;
  }

  /* Returns type. */
  get type() {
    if (this.#_.type === undefined) {
      this.#_.type = this.#_.types.split(".").reverse()[0];
    }
    return this.#_.type;
  }
}

(() => {
  const path = new Path("@/test/foo/foo.test.js?raw&nocache");
  console.log("suffix:", path.suffix);
  console.log("types:", path.types);
  console.log("type:", path.type);
  console.log("raw:", path.query.has("raw"));
  console.log("nocache:", path.query.has("nocache"));
  console.log("key:", path.key);
})();

console.info("Vite environment:", import.meta.env.MODE);
