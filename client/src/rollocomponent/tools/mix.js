/*
import { mix } from "@/rollocomponent/tools/mix.js";
const { mix } = await use("@/rollocomponent/tools/mix.js");
20250604
v.1.1
*/

/* Utility for prototype chain inspection. 
Can be used to access members of classes in prototype chain, 
when the use of 'super' is inadequate. */
class Meta {
  #_ = {
    registry: new Map(),
  };

  constructor(base, config) {
    this.#_.base = base;
    this.#_.config = config;
    this.add(base);
  }

  /* Return base. */
  get base() {
    return this.#_.base;
  }

  /* Returns __name__-classes in prototype chain as entries. */
  classes() {
    return this.#_.registry.entries();
  }

  /* Return config as used during composition. */
  get config() {
    return this.#_.config;
  }

  /* Add  */
  add(cls) {
    if (Object.hasOwn(cls, "__name__")) {
      if (this.#_.registry.has(cls.__name__)) {
        throw new Error(`Duplicate '__name__': ${cls.__name__}`);
      }
      this.#_.registry.set(cls.__name__, cls);
    }
  }

  /* Returns class in prototype chain by name (as per static '__name__) prop. */
  get(name) {
    return this.#_.registry.get(name);
  }

  /* Prevents addition of classes. */
  freeze() {
    /* NOTE Cheaper than Object.freeze */
    delete this.add;
    return this;
  }
}

export const mix = (base, config, ...mixins) => {
  if (typeof config === "object") {
    Object.freeze(config);
  }
  Object.freeze(mixins);
  const meta = new Meta(base, config);

  let cls = base;
  for (const mixin of mixins) {
    cls = mixin(cls, config, ...mixins);
    meta.add(cls);
  }

  Object.defineProperty(cls, "__meta__", {
    configurable: false,
    enumerable: true,
    writable: false,
    value: meta.freeze(),
  });

  return cls;
};
