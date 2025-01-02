/* Implements '$' getter. */
export const $ = (parent, config, ...factories) => {
  return class extends parent {
    static name = "$";

    /* Adds single json-compatible value
    XXX
    - Attempt to add non-json-compatible values will silently yield incorrect 
      results (string coercion), so use with care!
    EXAMPLES
      $.foo -> adds 'foo' (correct)
      $.true -> adds true (correct)
      $[42] -> adds 42 (correct)
      $['foo-bar'] -> adds 'foo-bar' (correct)
      $[document] -> adds '[object HTMLDocument]' (INCORRECT)
    */
    get $() {
      return this.#$;
    }
    #$ = new Proxy(this, {
      get: (target, value) => {
        try {
          value = JSON.parse(value);
          target.add(value);
        } catch {
          target.add(value);
        }
      },
    });
  };
};
