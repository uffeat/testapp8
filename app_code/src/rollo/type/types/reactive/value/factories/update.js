import { Change } from "@/rollo/type/types/reactive/tools/change";

export const update = (parent, config, ...factories) => {
  return class extends parent {
    static name = "update";

    #current;
    #previous;

    

    /* Returns current. */
    get $() {
      return this.current;
    }
    /* Sets current reactively. */
    set $(current) {
      this.current = current;
    }

    /* Returns current. */
    get current() {
      return this.#current;
    }
    /* Sets current reactively. */
    set current(value) {
      this.update(value);
    }

    /* Returns previous. */
    get previous() {
      return this.#previous;
    }

    /* Updates current reactively. */
    update(value, { sender, silent } = {}) {
      /* Prevent update as per condition */
      if (this.condition && !this.condition.call(this, value, { sender }))
        return this;
      /* Transform value as per transformer */
      if (this.transformer) {
        const result = this.transformer.call(this, value, { sender });
        if (result !== undefined) {
          value = result;
        }
      }
      if (this.match(value)) {
        return this;
      }
      this.#previous = this.current;
      this.#current = value;
      /* Handle effects */
      let result;
      if (this.effects && !silent) {
        /* Call default-type effects */
        if (this.effects.size()) {
          result = this.effects.call(
            Object.freeze({
              current: this.current,
              previous: this.previous,
            }),
            "",
            { sender }
          );
        }
      }
      return result === undefined ? this : result;
    }
  };
};
