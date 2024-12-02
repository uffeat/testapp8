
/* Base factory for all web components. */
export const base = (parent) => {
  /* Base factory that 'component' relies on */
  const cls = class Base extends parent {
    constructor(...args) {
      super(...args);
      /* Identify as web component. */
      this.setAttribute("web-component", "");
     
    }

    

    /* Provides external access to super. */
    get __super__() {
      return this.#__super__;
    }
    #__super__ = new Proxy(this, {
      get: (target, key) => {
        return super[key];
      },
      set: (target, key, value) => {
        super[key] = value;
        return true;
      },
    });

    

    

    

    /*
    TODO
    Probably purge?
    */
    add_event_handler(
      type,
      handler,
      { return_handler = false, run = false } = {}
    ) {
      this.addEventListener(type, handler);
      if (run) {
        handler({});
      }
      if (return_handler) {
        return handler;
      }
      return this;
    };


    

    
    
  };
  return cls;
};