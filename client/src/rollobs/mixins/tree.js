/*
const tree = await use("@/rollobs/mixins/tree.js");
20250531
v.1.0
*/
const { Tree } = await use("@/rollobs/tools/tree.js");

export const tree = (parent, config) => {
  return class extends parent {
   #_ = {};
    constructor() {
      super();
      /* Add state */
      this.#_.tree = new Tree(this);
    }
    /* Returns tree. */
    get tree() {
      return this.#_.tree;
    }

    /* Sets tree. */
    set tree(tree) {
      this.#_.tree = tree;
    }
  };
};
