/* Factory with short-hand for 'textContent'. */
export const text = (parent, config, ...factories) => {
  const cls = class Text extends parent {
    get text() {
      return this.textContent;
    }
    set text(text) {
      this.textContent = text;
    }
  };
  return cls;
};
