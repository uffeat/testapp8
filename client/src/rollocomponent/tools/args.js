/*
const { Args } = await use("@/rollocomponent/tools/args.js");
20250530
v.1.0
*/

export class Args {
  #_ = {};
  constructor(args) {
    this.#_.args = args;
  }

  /* Returns children. */
  get children() {
    if (this.#_.children === undefined) {
      this.#_.children = Object.freeze(
        this.#_.args.filter(
          (a, i) =>
            a instanceof Node || (i && ["number", "string"].includes(typeof a))
        )
      );
    }
    return this.#_.children;
  }

  /* Returns CSS classes */
  get classes() {
    if (this.#_.classes === undefined) {
      this.#_.classes = this.#_.args.find(
        (a, i) => !i && typeof a === "string"
      );
    }
    return this.#_.classes;
  }

  /* Returns hooks. */
  get hooks() {
    if (this.#_.hooks === undefined) {
      this.#_.hooks = this.#_.args.filter((a) => typeof a === "function");
    }
    return this.#_.hooks;
  }

  /* Returns updates. */
  get updates() {
    if (this.#_.updates === undefined) {
      this.#_.updates = Object.freeze(
        this.#_.args.find(
          (a, i) =>
            i < 2 &&
            typeof a === "object" &&
            !(a instanceof Node) &&
            typeof a !== "function" &&
            !Array.isArray(a)
        ) || {}
      );
    }
    return this.#_.updates;
  }
}
