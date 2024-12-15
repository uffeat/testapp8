import { check_factories } from "rollo/utils/check_factories";
import { attribute, items } from "rollo/factories/__factories__";

/* Factory with MutationsObserver for observing element children. */
export const observer = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([attribute, items], factories);

  const cls = class Observer extends parent {
    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback() {
      super.created_callback && super.created_callback();
      this.observer.start();
    }

    get observer() {
      return this.#observer;
    }
    #observer = new (class {
      #config = {
        childList: true,
        subtree: false,
      };

      constructor(owner) {
        this.#owner = owner;
        if (
          ["child_added_callback", "child_removed_callback"].every(
            (method) => typeof owner[method] !== "function"
          )
        ) {
          /* Warn */
          if (import.meta.env.DEV) {
            console.warn(
              `component does not have a 'child_added_callback' method, nor a 'child_removed_callback'. The 'observer' factory therefore has no effect.`
            );
          }
        }
      }

      get owner() {
        return this.#owner;
      }
      #owner;

      /* Activates observer */
      start = () => {
        if (this.#observes) {
          return;
        }
        this.#mutation_observer.observe(this.owner, this.#config);
        this.#observes = true;

        this.owner.attribute.observes = true;
      };

      /* Dectivates observer */
      stop = () => {
        if (!this.#observes) {
          return;
        }
        this.#mutation_observer.disconnect();
        this.#observes = false;
        this.owner.attribute.observes = false;
      };

      #handler = (mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            [...mutation.addedNodes].forEach((node) => {
              if (this.owner.child_added_callback) {
                this.owner.child_added_callback(node);
              }
            });

            [...mutation.removedNodes].forEach((node) => {
              if (this.owner.child_removed_callback) {
                this.owner.child_removed_callback(node);
              }
            });
          }
        });
      };
      #mutation_observer = new MutationObserver(this.#handler);
      #observes = false;
    })(this);
  };
  return cls;
};
