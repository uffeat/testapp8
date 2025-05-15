/* 

*/

export const text = (parent, config, ...factories) => {
  return class extends parent {
    static name = "text";

    /* Returns label text. */
    get text() {
      const { label } = this.__elements__;
      return label.text || null;
    }
    /* Sets label text. */
    set text(text) {
      const { label } = this.__elements__;
      label.text = text;
    }
  };
};
