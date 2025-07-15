/*
import send from "@/rollocomponent/mixins/send.js";
20250527
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    static __name__ = "send";
    /* Dispatches event with additional options and a leaner syntax. */
    send(type, { detail, trickle, ...options } = {}) {
      
      const event =
        detail === undefined
          ? new Event(type, options)
          : new CustomEvent(type, { detail, ...options });
      this.dispatchEvent(event);
      if (trickle) {
        const elements =
          typeof trickle === "string"
            ? this.querySelectorAll(trickle)
            : this.children;

        for (const element of elements) {
          element.dispatchEvent(event);
        }
      }
      /* Return event. Useful, when detail is mutable */
      return event;
    }
  };
};
