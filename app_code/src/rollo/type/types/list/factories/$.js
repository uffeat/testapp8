/* Implements '$' getter. */
export const $ = (parent, config, ...factories) => {
  return class extends parent {
    static name = "$";

    /* Adds single json-compatible value
    NOTE
    - Attempt to add non-json-compatible values will silently yeld incorrect 
      results (string coercion), so use with care!
    - Examples: 
      $.foo -> adds 'foo' (correct)
      $.true -> adds true (correct)
      $[42] -> adds 42 (correct)
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
