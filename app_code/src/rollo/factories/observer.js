import { send } from "rollo/factories/send";
import { state } from "rollo/factories/state";

/* Factory with MutationsObserver for observing element children  */
export const observer = (parent, config, ...factories) => {
  if (!factories.includes(send)) {
    throw new Error(`observer factory requires send factory`);
  }
  if (!factories.includes(state)) {
    throw new Error(`observer factory requires state factory`);
  }
  const cls = class Observer extends parent {
    #observe;
    #observer;
    #set_observe = this.reactive.protected.add("__observe__");
    constructor(...args) {
      super(...args);

      const component = this;

      this.#observer = new (class {
        #config = {
          childList: true,
          subtree: false,
        };

        #handler = (mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
              [...mutation.addedNodes]
                .filter(
                  (node) =>
                    node instanceof HTMLElement &&
                    node.hasAttribute("web-component")
                )
                .forEach((node) => {
                  //node.reactive.protected.remove("parent");
                  const set_parent = node.reactive.protected.add("__parent__");
                  set_parent(component);

                  component.send("child_added", {
                    detail: { added_child: node },
                  });
                });
              [...mutation.removedNodes]
                .filter(
                  (node) =>
                    node instanceof HTMLElement &&
                    node.hasAttribute("web-component")
                )
                .forEach((node) => {
                  const set_parent = node.reactive.protected.add("__parent__");
                  set_parent(null);

                  component.send("child_removed", {
                    detail: { removed_child: node },
                  });
                });
            }
          });
        };
        #mutation_observer = new MutationObserver(this.#handler);
        #observes = false;

        /* Activates child observer */
        start = () => {
          if (this.#observes) {
            return;
          }
          this.#mutation_observer.observe(component, this.#config);
          this.#observes = true;
          component.attribute.observes = true;
        };

        /* Dectivates child observer */
        stop = () => {
          if (!this.#observes) {
            return;
          }
          this.#mutation_observer.disconnect();
          this.#observes = false;
          component.attribute.observes = false;
        };
      })();
    }

    get observe() {
      return this.#observe;
    }

    /* Flag to control start/stop of observer. 
    Also sets protected '__observe__' state. */
    set observe(observe) {
      observe = !!observe;
      if (observe) {
        this.#observer.start();
      } else {
        this.#observer.stop();
      }
      this.#observe = observe;
      this.#set_observe(observe);
    }
  };
  return cls;
};
