import { Subscription } from "rollo/type/types/subscription/subscription";

/* Implements update method. */
export const update = (parent, config, ...factories) => {
  return class update extends parent {
    /* Mutates items reactively from provided 'update'. Chainable. 
    NOTE
    - By convention, an undefined value is a cue to delete.
    */
    update(update) {
      if (!update) return this;
      /* Update defined properties */
      Object.entries(update)
        .filter(([k, v]) => this.__chain__.defined.has(k))
        .forEach(([k, v]) => (this[k] = v));
      /* Remove defined from update */
      update = Object.fromEntries(
        Object.entries(update).filter(
          ([k, v]) => !this.__chain__.defined.has(k)
        )
      );

      console.log('update:', update)////

      /*
      const subscriptions = []
      for (const [k, v] of Object.entries(update)) {
        if (v instanceof Subscription) {
          subscriptions.push([k, v])
          delete update[k]
        }
      }
      console.log('subscriptions:', subscriptions)////
      */

      /* Filter updates as per condition */
      if (this.condition) {
        update = Object.fromEntries(
          Object.entries(update).filter(this.condition)
        );
      }
      /* Transform updates as per transformer */
      if (this.transformer) {
        update = Object.fromEntries(
          Object.entries(update).map(this.transformer)
        );
      }
      /* Infer changes */
      let current;
      let previous;
      if (this.effects && this.effects.size) {
        previous = this.difference(update);
        current = Object.fromEntries(
          Object.entries(previous).map(([k, v]) => [k, this[k]])
        );
      }
      /** Update */
      Object.entries(update).forEach(([k, v]) => (this[k] = v));
      /* Remove items with undefined value */
      [...this.entries].forEach(([k, v]) => {
        if (v === undefined) {
          delete this[k];
        }
      });
      /* Call effects */
      if (current) {

        console.log('current:', current)////
        console.log('previous:', previous)////



        this.effects({ current, previous });
      }
      return this;
    }
  };
};
