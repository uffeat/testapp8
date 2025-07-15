/*
import parent from "@/rollocomponent/mixins/parent.js";
20250530
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    static __name__ = "parent";

    #_ = {};

    /* Returns parent. */
    get parent() {
      return this.parentElement;
    }

    /* Appends component to parent or removes component. */
    set parent(parent) {
      console.log("Got parent:", parent);

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
