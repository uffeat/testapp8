/* Utility for parsing path. 
NOTE
- Part of Rollo's import system. */
export class Path {
  static PUBLIC_PREFIX = "/";
  static RAW_QUERY = "?raw";
  static SRC_PREFIX = "@/";
  static create = (arg) => {
    if (arg instanceof Path) {
      return arg;
    }
    return new Path(arg);
  };

  #key;
  #path;
  #public;
  #query;
  #raw;
  #specifier;
  #src;
  #type;

  constructor(specifier) {
    this.#specifier = specifier;
  }

  /* Returns combined file type and query. */
  get key() {
    if (this.#key === undefined) {
      this.#key = this.raw ? `${this.type}${Path.RAW_QUERY}` : this.type;
    }
    return this.#key;
  }

  /* Returns actual path.
  NOTE
  - Reconciles src paths with respect to the '@/'-syntax.
  - Adjusts public paths with respect environment.
  - Strips away any queries. */
  get path() {
    if (this.#path === undefined) {
      this.#path = this.raw
        ? this.specifier.slice(0, -Path.RAW_QUERY.length)
        : this.specifier;

      if (this.src) {
        this.#path = `/src/${this.#path.slice(Path.SRC_PREFIX.length)}`;
      } else if (this.public) {
        this.#path = `${import.meta.env.BASE_URL}${this.#path.slice(
          Path.PUBLIC_PREFIX.length
        )}`;
      }
    }
    return this.#path;
  }

  /* Returns public flag. */
  get public() {
    if (this.#public === undefined) {
      this.#public = this.specifier.startsWith(Path.PUBLIC_PREFIX);
    }
    return this.#public;
  }

  /* Returns query with '?'-prefix. Returns empty string, if no query. */
  get query() {
    if (this.#query === undefined) {
      this.#query = this.specifier.includes("?")
        ? `?${this.specifier.split("?").reverse()[0]}`
        : "";
    }
    return this.#query;
  }

  /* Returns raw flag. */
  get raw() {
    if (this.#raw === undefined) {
      this.#raw = this.specifier.endsWith(Path.RAW_QUERY);
    }
    return this.#raw;
  }

  /* Returns src flag. */
  get src() {
    if (this.#src === undefined) {
      this.#src = this.specifier.startsWith(Path.SRC_PREFIX);
    }
    return this.#src;
  }

  /* Returns original path specifier. */
  get specifier() {
    return this.#specifier;
  }

  /* Returns file type. */
  get type() {
    if (this.#type === undefined) {
      this.#type = this.path.split(".").reverse()[0];
    }
    return this.#type;
  }
}