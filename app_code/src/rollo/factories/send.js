/* Factory for all web components. */
export const send = (parent, config, ...factories) => {
  const cls = class Send extends parent {
    constructor(...args) {
      super(...args);
    }

    /* Dispatches custom event and returns detail. */
    send(type, { detail, ...options } = {}) {
      this.dispatchEvent(new CustomEvent(type, { detail, ...options }));
      /* NOTE If detail is mutable, it's handy to get it back, 
      since handler may have mutated it. This enables two-way communication 
      between event target and handler. */
      return detail;
    }
  };
  return cls;
};
