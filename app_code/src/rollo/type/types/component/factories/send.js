export const send = (parent, config, ...factories) => {
  return class extends parent {
    static name = "send";


    send(type, { detail, trickle, ...options } = {}) {
      let event;
      if (detail) {
        event = new CustomEvent(type, { detail, ...options });
      } else {
        event = new Event(type, options);
      }
      this.dispatchEvent(event);
      if (trickle) {
        let elements;
        if (typeof trickle === "string") {
          elements = this.querySelectorAll(trickle);
        } else {
          elements = this.children;
        }
        for (const element of elements) {
          element.dispatchEvent(event);
        }
      }
      /* Return event. Useful, when mutable data */
      return event;
    }




  };
};
