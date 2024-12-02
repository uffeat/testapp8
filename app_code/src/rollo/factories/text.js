export const text = (parent, config, ...factories) => {
  /* Factory for components with 'textContent' prop */
  const cls = class Text extends parent {
    constructor(...args) {
      super(...args);
    }

    get text() {
      return this.textContent;
    }
    set text(text) {
      this.textContent = text;
    }
  };
  return cls;
}