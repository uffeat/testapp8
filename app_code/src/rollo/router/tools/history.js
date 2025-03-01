//import { History } from "rollo/tools/history";

import { Reactive } from "rollo/reactive/reactive_value";

class cls {
  #path;

  constructor() {
    this.#path = Reactive(null, { owner: this });

    parent.addEventListener("popstate", (event) => {
      const path = parent.location.pathname;
      this.#path.update(path);
    });

    this.#path.effects.add(({ current }) => {
      this.#push(current);
    }, {run: false});
  }

  /* Returns reactive controller for path */
  get path() {
    return this.#path;
  }

  #push(path) {
    /* Use 'parent' so that app can be served as an iframe. */
    const current = parent.location.pathname;
    /* Check is likely redundant, since Reactive only triggers, when change... */
    if (path !== current) {
      /* Since 'path' is NOT the native href, need to reconstruct full url */
      const url = `${parent.location.origin}${path}${parent.location.search}${parent.location.hash}`;
      parent.history.pushState({}, "", url);
    }
  }
}

/* Controller for history state. */
export const History = new cls();
