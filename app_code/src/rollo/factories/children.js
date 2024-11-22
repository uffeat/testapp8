// TODO Rethink as mixin, composition, decorator and/or util - or functional web component!


export const children = (parent) => {
  /* Factory with MutationsObserver  */
  const cls = class Children extends parent {
    #child_observer;
    constructor(...args) {
      super(...args);
      const component = this;
      this.#child_observer = new (class ChildObserver {
        #handler = (mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
              [...mutation.addedNodes]
                .filter((node) => node instanceof HTMLElement)
                .forEach((node) => {
                  node.send("added_to_parent", {
                    detail: { new_parent: component },
                  });
                  component.send("child_added", {
                    detail: { added_child: node },
                  });
                });
              [...mutation.removedNodes]
                .filter((node) => node instanceof HTMLElement)
                .forEach((node) => {
                  node.send("removed_from_parent", {
                    detail: { previous_parent: component },
                  });
                  component.send("child_removed", {
                    detail: { removed_child: node },
                  });
                });
            }
          });
        };
        #mutation_observer = new MutationObserver(this.#handler);
        #observes = false;
        #use = false;

        /* Activates child observer until component disconnect */
        start = () => {
          if (this.#observes) {
            return;
          }
          this.#mutation_observer.observe(component, {
            childList: true,
            subtree: false,
          });
          this.#observes = true;
        };

        /* Dectivates child observer */
        stop = () => {
          if (!this.#observes) {
            return;
          }
          this.#mutation_observer.disconnect();
          this.#observes = false;
        };

        get use() {
          return this.#use;
        }

        /* Contols useage of child observer.
        falsy: Stops observer.
        true: Runs observer and keeps it running.
        1: Runs observer, whenever component is connected. */
        set use(use) {
          if (!use) {
            this.stop();
          } else if (use === true) {
            this.start();
          } else if (use === 1) {
            if (component.isConnected) {
              this.start();
            }
          } else {
            throw new Error(`Invalid use: ${use}`);
          }
          this.#use = use;
          component.attribute.dataChildObserver = use;
        }
      })();
    }

    get child_observer() {
      return this.#child_observer;
    }

    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      if (this.child_observer.use) {
        this.child_observer.start();
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();
      if (this.child_observer.use !== true) {
        this.child_observer.stop();
      }
    }
  };
  return cls;
}