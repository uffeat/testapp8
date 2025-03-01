import { type } from "rollo/type/type/type";

const tag = "web-component";

const cls = (() => {
  class WebComponent extends HTMLElement {
    static name = "WebComponent";

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      const slot = document.createElement('slot')
      Object.defineProperty(this.shadowRoot, `slot`, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: slot
      });
      this.shadowRoot.append(slot);

    }

    /* Dispatches 'connected' event. */
    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      this.dispatchEvent(new CustomEvent("connected"));
    }

    /* Dispatches 'disconnected' event. */
    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();
      this.dispatchEvent(new CustomEvent("disconnected"));
    }
  }

  const cls = type.register(WebComponent, tag);
  customElements.define(tag, cls);
  return cls;
})();

/* . */
export function WebComponent() {
  const instance = type.create("web-component");
  return instance;
}

export const WebComponentType = cls;
