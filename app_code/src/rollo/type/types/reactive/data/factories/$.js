/* Implements '$'. */
export const $ = (parent, config, ...factories) => {
  return class extends parent {
     static name = '$';
     
    /* Returns object, from which reactive item value can be 
    retirieved/updated. */
    get $() {
      return this.#$;
    }
    #$ = new Proxy(this, {
      get: (target, key) => {
        return target.current[key];
      },
      set: (target, key, value) => {
        target.update({ [key]: value });
        return true;
      },
    });
  };
};
