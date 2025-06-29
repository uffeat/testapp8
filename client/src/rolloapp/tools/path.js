/*
import { Path } from "@/rolloapp/tools/path.js";
20250526
v.2.1
*/

/* Utility for parsing path. */
export class Path {
  static create = (arg) => {
    if (arg instanceof Path) {
      return arg;
    }
    return new Path(arg);
  };

  #_ = {
    parcel: false,
  };

  constructor(specifier, {owner} = {}) {
    this.#_.owner = owner;
    /* Specifier and parcel */
    if (specifier.endsWith("/")) {
      /* Accommodate the (Python-package-like) "parcel" short-hand syntax */
      specifier = `${specifier}__init__.js`;
      this.#_.parcel = true;
    } 
    this.#_.specifier = specifier;
    /* File name */
    this.#_.file = specifier.split("/").reverse()[0];
    const [stem, ...types] = this.#_.file.split(".");
    this.#_.stem = stem;
    this.#_.types = types.join(".");
    this.#_.type = this.#_.types.split(".").reverse().at(0);
    /* Dir path */
    this.#_.public = specifier.startsWith("/");
    this.#_.path = this.#_.public
      ? specifier
      : `/src/${specifier.slice("@/".length)}`;
  }

  get __dict__() {
    return this.#_;
  }

  /* Returns file. */
  get file() {
    return this.#_.file;
  }

  /* Returns native path. */
  get path() {
    return this.#_.path;
  }

  /* Returns parcel flag. */
  get parcel() {
    return this.#_.parcel;
  }

  /* Returns public flag. */
  get public() {
    return this.#_.public;
  }

  /* Returns original specifier (subject to any parcel adjustment). */
  get specifier() {
    return this.#_.specifier;
  }

  /* Returns stem. */
  get stem() {
    return this.#_.stem;
  }

  /* Returns types. */
  get types() {
    return this.#_.types;
  }

  /* Returns type. */
  get type() {
    return this.#_.type;
  }
}
