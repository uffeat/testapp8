/*
import shadow from "@/rollocomponent/mixins/shadow.js";
const shadow = await use("@/rollocomponent/mixins/shadow.js");
20250531
v.1.0
*/



export default (parent, config) => {
  return class extends parent {
    static __name__ = "shadow";
    
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `<slot></slot>`;
    }
  };
};
