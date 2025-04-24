//import { Path } from "rollo/tools/path";

class cls {
  #array;
  #path;
  constructor(path) {
    if (!path.startsWith('/')) {
      path = `/${path}`
    }
    this.#path = path;
    this.#array = path.slice(1).split("/");
  }

  get array() {
    return [...this.#array];
  }

  get start() {
    return this.#array[0];
  }

  get end() {
    return this.#array[this.size - 1];
  }

  get path() {
    return this.#path;
  }

  get size() {
    return this.#array.length;
  }

  get(index) {
    this.#array.at(index) || null;
  }

  has(part) {
    return this.#array.includes(part);
  }

  index(part) {
    return this.#array.findIndex((p) => p === part);
  }
}

export const Path = (path) => new cls(path);
