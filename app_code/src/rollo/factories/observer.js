import { check_factories } from "rollo/utils/check_factories";
import { attribute, events, items } from "rollo/factories/__factories__";

/* Factory with MutationsObserver for observing element children. */
export const observer = (parent, config, ...factories) => {
  /* Check factory dependencies */
  check_factories([attribute, events, items], factories);

  const cls = class Observer extends parent {
    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback(config) {
      super.created_callback && super.created_callback(config);
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
      }

      get owner() {
        return this.#owner
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
            [...mutation.addedNodes]
              .filter(
                (node) =>
                  node instanceof HTMLElement &&
                ('items' in node)
              )
              .forEach((node) => {
                node.items.$.parent = this.owner;

                this.owner.send("child_added", {
                  detail: { added_child: node },
                });
              });
            [...mutation.removedNodes]
              .filter(
                (node) =>
                  node instanceof HTMLElement &&
                  ('items' in node)
              )
              .forEach((node) => {
                node.items.$.parent = null;

                this.#owner.send("child_removed", {
                  detail: { removed_child: node },
                });
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
