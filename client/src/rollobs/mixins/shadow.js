/*
const shadow = await use("@/rollobs/mixins/shadow.js");
20250531
v.1.0
*/

export const shadow = (parent, config) => {
  return class extends parent {
    
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `<slot></slot>`;
    }
  };
};
