/*
import tab from "@/rollocomponent/mixins/tab.js";
20250530
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    static __name__ = "parent";
    /* Returns parent. */
    get parent() {
      return this.parentElement;
    }

    /* Appends component to parent or removes component. */
    set parent(parent) {
      /* Abort, if parent is undefined */
      if (parent === undefined) return;
      /* Abort, if no change */
      if (parent === this.parentElement) return;

      if (parent === null) {
        /* Remove, if parent is null */
        this.remove();
      } else {
        parent.append(this);
      }
    }
  };
};
