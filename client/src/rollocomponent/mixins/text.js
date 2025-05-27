/*
import text from "@/rollocomponent/mixins/text.js";
20250527
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    /* Returns text content. */
    get text() {
      return this.textContent || null;
    }

    /* Sets text content. */
    set text(text) {
      this.textContent = text;
    }
  };
};
