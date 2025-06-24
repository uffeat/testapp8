/* 

*/

export const suffix = (parent, config, ...factories) => {
  return class extends parent {
    static name = "suffix";

  /* Returns suffix. */
  get suffix() {
    return this.__elements__.suffix.firstChild;
  }
  /* Sets suffix. */
  set suffix(node) {
    const suffix = this.__elements__.suffix;
    if (node) {
      const group = this.__elements__.group
      suffix.clear();
      suffix.append(node);
      if (!group.contains(suffix)) {
        group.insertAdjacentElement(
          "beforeend",
          suffix
        );
      }
    } else {
      suffix.remove();
    }
  }
  };
};
