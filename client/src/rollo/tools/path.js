/*
import { Path } from "@/rollo/tools/path.js";
*/

// WORK IN PROGRESS

/* Utility for parsing file name. */
export class File {
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

  /* Returns array of extensions. */
  get extensions() {
    if (this.#_.extensions === undefined) {
      this.#_.extensions =  Object.freeze([]);////
    }
    return this.#_.extensions;
  }

  /* Returns query object. */
  get query() {
    if (this.#_.query === undefined) {
      this.#_.query = Object.freeze({});////
    }
    return this.#_.query;
  }

  

  /* Returns file name. */
  get name() {
    if (this.#_.name === undefined) {
      this.#_.name = 42;////
    }
    return this.#_.name;
  }

  /* Returns original path specifier. */
  get specifier() {
    return this.#_.specifier;
  }

  /* Returns file stem. */
  get stem() {
    if (this.#_.stem === undefined) {
      this.#_.stem = 42;////
    }
    return this.#_.stem;
  }

  /* Returns file type. */
  get type() {
    if (this.#_.type === undefined) {
      this.#_.type = 42;////
    }
    return this.#_.type;
  }



  
}




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

  /* Returns base dir. */
  get base() {
    if (this.#_.base === undefined) {
      this.#_.base = 42;////
    }
    return this.#_.base;
  }

  

  /* Returns File instance or null, if pure dir path. */
  get file() {
    if (this.#_.file === undefined) {
      this.#_.file = null;////
    }
    return this.#_.file;
  }

  

  /* Returns array of parent dirs. */
  get parents() {
    if (this.#_.parents === undefined) {
      this.#_.parents = Object.freeze([]);////
    }
    return this.#_.parents;
  }

  /* Returns path without query. */
  get path() {
    if (this.#_.path === undefined) {
      this.#_.path = 42;////
    }
    return this.#_.path;
  }

  

  

  /* Returns original path specifier. */
  get specifier() {
    return this.#_.specifier;
  }

  

  /* Checks is path in ref path. */
  in(ref) {}

  /* Checks is path contains ref path. */
  has(ref) {
    
  }
}
