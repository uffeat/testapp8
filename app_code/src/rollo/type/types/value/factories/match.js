/* Implements configurable 'match' method. */
export const match = (parent, config, ...factories) => {
  return class extends parent {
    static name = "match";

    /* Returns match function. */
    get match() {
      return this.#match;
    }
    /* Sets match function. */
    set match(match) {
      this.#match = match;
    }
    #match = (other) => this.current === other;
  };
};
