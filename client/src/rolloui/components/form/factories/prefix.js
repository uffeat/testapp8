/* 

*/

export const prefix = (parent, config, ...factories) => {
  return class extends parent {
    static name = "prefix";

    /* Returns prefix (only child of prefix container). */
    get prefix() {
      return this.__elements__.prefix.firstChild;
    }
    /* Sets prefix. */
    set prefix(node) {
      const { group, prefix } = this.__elements__;
      if (node) {
        prefix.clear().append(node);
        if (!group.contains(prefix)) {
          group.elements.insert.afterbegin(prefix);
        }
      } else {
        prefix.remove();
      }
    }
  };
};
