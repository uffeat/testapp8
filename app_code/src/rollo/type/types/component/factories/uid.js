export const uid = (parent, config, ...factories) => {
  const UID = "uid";
  const observedAttributes = config.observedAttributes;
  observedAttributes.push(UID);

  return class extends parent {
    static name = "uid";

    #uid;

    constructor() {
      super();
      this.#uid = create_uid();
      this.setAttribute(UID, `${this.uid}`);
    }

    attributeChangedCallback(name, previous, current) {
      super.attributeChangedCallback &&
        super.attributeChangedCallback(name, previous, current);

      if (name === UID) {
        const value = `${this.uid}`;
        if (current !== value) {
          console.error(
            `'${UID}' cannot be changed. Reverting to original:`,
            value
          );
          this.setAttribute(UID, value);
        }
      }
    }

    get uid() {
      return this.#uid;
    }
  };
};

/* Returns unique uid. */
const create_uid = (() => {
  let uid = 0;
  return () => {
    return uid++;
  };
})();
