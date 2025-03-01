// import { Effects } from "@/rollo/type/types/reactive/tools/effects";
// const { Effects } = await import("@/rollo/type/types/reactive/tools/effects");

import { Change } from "@/rollo/type/types/reactive/tools/change";

/* Returns effects controller. */
export const Effects = (...args) => {
  return new EffectsType(...args);
};

/* Effects controller. */
export class EffectsType {
  static name = "EffectsType";

  #owner;
  #registry = new Map();
  #session = null;

  constructor(owner) {
    this.#owner = owner;
  }

  /* Returns owner. */
  get owner() {
    return this.#owner;
  }

  /* Returns registry. */
  get registry() {
    return this.#registry;
  }

  /* Returns session. */
  get session() {
    return this.#session;
  }

  /* Returns array of registered types. */
  get types() {
    return [...this.#registry.keys()];
  }

  /* Registers and returns effect. Option to run effect. */
  add(effect, ...args) {
    let run = null;
    let type = "";
    if (args.length === 1) {
      const arg = args[0];
      if (typeof arg === "string") {
        type = arg;
      } else if (typeof arg === "boolean") {
        run = arg;
      } else {
        const message = `Invalid arguments`;
        console.error(`${message}:`, args);
        throw new Error(message);
      }
    } else if (args.length === 2) {
      const [_type, _run] = args;
      type = type;
      run = _run;
    } else if (args.length > 2) {
      const message = `Too many arguments`;
      console.error(`${message}:`, args);
      throw new Error(message);
    }

    let registry = this.#registry.get(type);
    if (!registry) {
      registry = new Set();
      this.#registry.set(type, registry);
    }
    registry.add(effect);

    if (run || (run !== false && effect.config && effect.config.run)) {
      this.run(effect, type);
    }
    return effect;
  }

  /* Calls effects of a given type. 
  NOTE
  - Standard usage:
    Call from owner state's 'update'.
  - Special usage:
    Call explicitly. Useful for custom effects, testing and special cases.
    - A new session is NOT triggered, if data is undefined
    - If data undefined, a ChangeType instance is automatically created with 
      an empty object 'data' prop. 
    - Result of last non-undefined effect result is returned (if any). */
  call(data, type = "", { sender } = {}) {
    let _stop = false;
    const stop = () => {
      _stop = true;
    };

    let change;
    if (data === undefined) {
      change = Change({
        data: {},
        owner: this.owner,
        sender,
        stop,
        type,
      });
    } else {
      this.#session = this.#session === null ? 0 : ++this.#session;
      change = Change({
        data,
        owner: this.owner,
        sender,
        session: this.session,
        stop,
        type,
      });
    }

    let result;
    for (const [index, effect] of this.effects(type).entries()) {
      change.effect = effect;
      change.index = index;
      change.result = result;
      result = effect.call(this.owner, change);
      if (_stop) {
        break;
      }
    }

    return result === undefined ? this : result;
  }

  /* Removes all effects of a given type. */
  clear(type = "") {
    const registry = this.#registry.get(type);
    if (registry) {
      registry.clear();
    }
    return this;
  }

  /* Returns array of effects for a given type. */
  effects(type = "") {
    const registry = this.#registry.get(type);
    if (registry) {
      return [...registry.values()];
    }
    return [];
  }

  /* Tests, if effect registered with a given type. */
  has(effect, type = "") {
    const registry = this.#registry.get(type);
    if (registry) {
      return registry.has(effect);
    }
    return false;
  }

  /* Removes effect for a given type. */
  remove(effect, type = "") {
    const registry = this.#registry.get(type);
    if (registry) {
      registry.delete(effect);
      if (!registry.size) {
        this.#registry.delete(type);
      }
    }

    return this;
  }

  /* Calls effect and returns its result. 
  NOTE
  - Candidate for overwriting. */
  run(effect, type = "") {
    const change = Change({
      data: {},
      effect,
      owner: this.owner,
      type,
    });
    return effect.call(this.owner, change);
  }

  /* Returns number of registered of effects for a given type. */
  size(type = "") {
    const registry = this.#registry.get(type);
    if (registry) {
      return registry.size;
    }
    return 0;
  }
}
