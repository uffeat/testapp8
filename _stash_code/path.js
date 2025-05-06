const PUBLIC = "/";
const SRC = "@/";

/* Util for parsing patch specifier.  */
export class Path {
  #extension;
  #format;
  #path;
  #public;
  #query;
  #specifier;
  #type;

  constructor(specifier) {
    this.#specifier = specifier;
  }

  /* Returns extension (format and type). */
  get extension() {
    if (this.#extension === undefined) {
      const file = this.path.split("/").reverse()[0];
      const [stem, ...meta] = file.split(".");
      this.#extension = meta.join(".");
    }
    return this.#extension;
  }

  /* Returns format ("secondary file type"). */
  get format() {
    if (this.#format === undefined) {
      this.#format = this.extension.includes(".")
        ? this.extension.split(".")[0]
        : "";
    }
    return this.#format;
  }

  /* Returns public flag (does the specifier pertain to /public?). */
  get public() {
    if (this.#public === undefined) {
      this.#public = this.#specifier.startsWith(PUBLIC);
    }
    return this.#public;
  }

  /* Returns specifier without query and, if public, adjusted with BASE_URL. */
  get path() {
    if (this.#path === undefined) {
      /* Remove query */
      this.#path = this.query
        ? this.#specifier.slice(0, -(this.query.length + 1))
        : this.#specifier;
      /* Correct source */
      if (this.#specifier.startsWith(PUBLIC)) {
        this.#path = `${import.meta.env.BASE_URL}${this.#path.slice(PUBLIC.length)}`;
      } else if (this.#path.startsWith(SRC)) {
        this.#path = `/src/${this.#path.slice(SRC.length)}`;
      }
    }
    return this.#path;
  }

  /* Returns any query key. */
  get query() {
    if (this.#query === undefined) {
      this.#query = this.#specifier.includes("?")
        ? this.#specifier.split("?").reverse()[0]
        : "";
    }
    return this.#query;
  }

  /* Returns file type. */
  get type() {
    if (this.#type === undefined) {
      this.#type = this.extension.includes(".")
        ? this.extension.split(".").reverse()[0]
        : this.extension;
    }
    return this.#type;
  }
}