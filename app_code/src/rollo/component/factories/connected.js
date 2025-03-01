export const connected = (parent, config, ...factories) => {
  return class extends parent {
    static name = "connected";

    /* Calls 'connected' effect and dispatches 'connected' event. */
    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      this.dispatchEvent(new CustomEvent("connected"));
    }

    /* Calls 'connected' effect and dispatches 'disconnected' event. */
    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();
      this.dispatchEvent(new CustomEvent("disconnected"));
    }
  };
};
