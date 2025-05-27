/*
import connect from "@/rollocomponent/mixins/connect.js";
20250527
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    
    /* Fires 'connected' event. 
    Enables hooking into lifecycle without using 'connectedCallback' multiple times. */
    connectedCallback() {
      super.connectedCallback?.();
      this.dispatchEvent(new CustomEvent("connected"));
    }

    /* Fires 'disconnected' event. 
    Enables hooking into lifecycle without using 'disconnectedCallback' multiple times.*/
    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.dispatchEvent(new CustomEvent("disconnected"));
    }
  };
};
