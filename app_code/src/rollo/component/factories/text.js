export const text = (parent, config, ...factories) => {
  return class extends parent {
    static name = "text";

    

    get text() {
      return this.textContent || null
    }
    set text(text) {
      this.textContent = text
    }

    
  };
};