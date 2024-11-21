// TODO Rethink as mixin, composition, decorator and/or util - or functional web component!

export const chain = [
  (tag) => true,
  (parent) => {
    /* Factory with prototype chain utils */
    const cls = class Chain extends parent {
      constructor(...args) {
        super(...args);
      }
      /* Returns prototype chain up until HTMLElement as a frozen array. */
      get chain() {
        /* NOTE Should give the same result as '__chain__' (created in Components.author),
        but is provided as prop that generates the chain at each invocation to ensure that 
        the returned value always corresponds to the current chain. */
        const chain = [];
        let proto = Object.getPrototypeOf(this).constructor;
        while (proto !== HTMLElement) {
          chain.push(proto);
          proto = Object.getPrototypeOf(proto);
        }
        Object.freeze(chain);
        return chain;
      }
    };
    return cls;
  }]