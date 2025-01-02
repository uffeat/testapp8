/* Implements '$' getter. */
export const $ = (parent, config, ...factories) => {
  return class extends parent {
     static name = '$'
     
    /*
    NOTE
    - Example: $.foo -> adds 'foo'
    */
    get $() {
      return this.#$;
    }
    #$ = new Proxy(this, {
      get: (target, key) => {
        return target.add(key);
      },
    });
  };
};
