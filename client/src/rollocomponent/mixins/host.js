/*
import host from "@/rollocomponent/mixins/host.js";
20250530
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    
    /* Returns closest 'host' component or the component itself, 
    if it has 'host' status. */
    get host() {
      if (this.hasAttribute("host")) {
        return this;
      }
      /* NOTE This would be less performant:
        return this.closest("[host]") || this
      */
      return this.closest("[host]");
    }

    /* Sets component's 'host' status. */
    set host(host) {
      if (host === true) {
        this.setAttribute("host", "");
        return;
      }
      if ([false, null].includes(host)) {
        this.removeAttribute("host");
        return;
      }
      console.warn('Invalid type:', host)
      throw new Error(`Invalid value.`)
    }
  };
};
