export default (parent, config) => {
  return class extends parent {
    get text() {
      return this.textContent || null;
    }

    set text(text) {
      this.textContent = text;
    }
  };
};
