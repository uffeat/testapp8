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
    #set_observe = this.reactive.protected.add("observe");
    constructor(...args) {
      super(...args);
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

    #observer = new (class {
      #config = {
        childList: true,
        subtree: false,
      };
      #owner

      constructor(owner) {
        this.#owner = owner

      }

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
                //const set_parent = node.reactive.protected.add("parent");
                //set_parent(component);
                node.$.parent = this.#owner

                this.#owner.send("child_added", {
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
                //const set_parent = node.reactive.protected.add("parent");
                //set_parent(null);
                node.$.parent = null


                this.#owner.send("child_removed", {
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
        this.#mutation_observer.observe(this.#owner, this.#config);
        this.#observes = true;
        this.#owner.attribute.observes = true;
      };

      /* Dectivates child observer */
      stop = () => {
        if (!this.#observes) {
          return;
        }
        this.#mutation_observer.disconnect();
        this.#observes = false;
        this.#owner.attribute.observes = false;
      };
    })(this);


  };
  return cls;
};
