/*
const tree = await use("@/rollobs/mixins/tree.js");
20250531
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    #_ = {};
    /* Returns tree. */
    get tree() {
      return this.#_.tree;
    }

    /* Sets tree. */
    set tree(tree) {
      if (tree) {
        this.removeAttribute("tree");
      } else {
        this.setAttribute("tree", "");
      }
      this.#_.tree = tree;
    }
  };
};
