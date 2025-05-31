/*
const state = await use("@/rollobs/mixins/state.js");
20250531
v.1.0
*/
const { State } = await use("@/rollobs/tools/state.js");

export const state = (parent, config) => {
  return class extends parent {
    #_ = {};
    constructor() {
      super();
      /* Add state */
      this.#_.state = new State(this);
    }

    /* Returns state controller. */
    get state() {
      return this.#_.state;
    }
  };
};
