export const match = (parent, config, ...factories) => {
  return class extends parent {
    static name = "match";

    #match;

    /* Initializes match. */
    __new__() {
      super.__new__ && super.__new__();
      /* Tests, if other matches current. */
      this.#match = _match.bind(this);
    }

    /* Returns match function. */
    get match() {
      return this.#match;
    }
    /* Sets match function. */
    set match(match) {
      if (!match) {
        match = _match
      } 
      this.#match = match.bind(this);
    }

    
  };
};

/* Default match. */
function _match(other) {
  return this.current === other;
}