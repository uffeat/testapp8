/* 
20250303
src/rollo/router/router/router.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/router/router/router.js
import { Router } from "rollo/router/router";
*/

import { Reactive } from "@/rollo/reactive/value.js";
import { History } from "@/rollo/router/tools/history.js";

class cls {
  #config;
  #error;
  #state;

  constructor() {
    this.#state = Reactive(null, { owner: this });

    const component = this;
    this.#config = new (class {
      get error() {
        return component.#error;
      }

      set error(error) {
        component.#error = error;
      }
    })();

    this.#state.effects.add(
      ({ current }) => {
        History.path.update(current);
      },
     
    );

    History.path.effects.add(
      ({ current }) => {
        this.#state.update(current);
      },
     
    );
  }

  /* Returns config object. */
  get config() {
    return this.#config;
  }

  /* Returns effects controller.
  NOTE
  - Useful for setting up effects that react to route changes, 
    e.g. for selecting links in nav groups. */
  get effects() {
    return this.#state.effects;
  }

  /* Returns current path. */
  get path() {
    return this.#state.current;
  }

  /* Adds and returns route. */
  add(path, route) {
    this.#state.effects.add(route);
    return route;
  }

  /* Calls error route (if configured). */
  error(...args) {
    if (this.#error) {
      this.#error(...args);
    }
  }

  /* Invokes route and updates history. */
  go(path) {
    const route = this.get(path);
    if (route) {
      this.#state.update(path);
    } else {
      console.warn("Invalid path:", path); ////
      this.error(path);
    }
  }

  get(path) {
    return this.#state.effects.get(path);
  }

  /* Removes route. */
  remove(path) {
    const route = this.get(path);
    this.#state.effects.remove(route);
    return this;
  }

  /* Adds routes. Chainable */
  update(routes) {
    Object.entries(routes).forEach(([path, route]) => this.add(path, route));
    return this;
  }

  /* Sets initial route. Chainable.
  NOTE
  - Convenience method that can be called, once routes have been added. */
  use() {
    const current = parent.location.pathname;
    if (current) {
      this.go(current);
    } else {
      this.go("/");
    }
    return this;
  }
}

export const Router = (routes = {}) => {
  const router = new cls();
  router.update(routes);
  return router;
};
