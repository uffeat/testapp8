//import { Reactive } from "rollo/reactive/reactive";

export const Reactive = (...args) => new Type(...args);

class Type {
  #$;
  #condition = null;
  #current = {};
  #detail = {};
  #effects;
  #name = null;
  #owner = null;
  #previous = {};
  #transformer = null;

  constructor(...args) {
    this.#effects = new Effects(this);

   

    const current = this.#current;
    this.#$ = new Proxy(this, {
      get: (target, key) => {
        return current[key];
      },
      set: (target, key, value) => {
        target.update({ [key]: value });
        return true;
      },
    });

    /* Set props */
    Object.entries(
      args.filter((a, i) => i && typeof a !== "function").at(0) || {}
    ).forEach(([k, v]) => k in this && (this[k] = v));

    /* Add effects */
    args
      .filter((a) => typeof a === "function")
      .forEach((e) => this.effects.add(e, null, false));

    /* Update current */
    this.update(
      args.filter((a, i) => !i && typeof a !== "function").at(0) || {}
    );
  }

  /* Returns object, from which reactive item value can be 
    retirieved/updated. */
  get $() {
    return this.#$;
  }

  get condition() {
    return this.#condition;
  }
  set condition(condition) {
    this.#condition = condition;
  }

  get current() {
    return { ...this.#current };
  }
  set current(current) {
    if (typeof current === "function") {
      current = current.call(this, this);
    }
    current = this.#convert(current);

    const to_remove = this.difference(current, true);
    for (const key of Object.keys(to_remove)) {
      current[key] = undefined;
    }
    this.update(current);
  }

  get detail() {
    return this.#detail;
  }
  set detail(detail) {
    this.#detail = detail;
  }

  get effects() {
    return this.#effects;
  }

  get name() {
    return this.#name;
  }
  set name(name) {
    this.#name = name;
  }

  get owner() {
    return this.#owner;
  }
  set owner(owner) {
    this.#owner = owner;
  }

  get previous() {
    return { ...this.#previous };
  }

  get transformer() {
    return this.#transformer;
  }
  set transformer(transformer) {
    this.#transformer = transformer;
  }

  clear() {
    this.update(this.entries().map(([k, v]) => [k, undefined]));
    return this;
  }

  difference(other, inverted = false) {
    other = this.#convert(other);
    if (inverted) {
      /* What does current have that other does not have? */
      return Object.fromEntries(
        Object.entries(this.#current).filter(
          ([k, v]) => other[k] === undefined || other[k] !== v
        )
      );
    } else {
      /* What does other have that current does not have? */
      return Object.fromEntries(
        Object.entries(other).filter(
          ([k, v]) => v === undefined || this.#current[k] !== v
        )
      );
    }
  }

  entries() {
    return Object.entries(this.#current);
  }

  filter(f) {
    return Object.fromEntries(this.entries().filter(f));
  }

  forEach(f) {
    this.entries().forEach(f);
    return this;
  }

  /* Tests, if key is in current. */
  has(key) {
    return key in this.#current;
  }

  intersection(other) {
    other = this.#convert(other);
    return Object.fromEntries(
      Object.entries(other).filter(([k, v]) => this.#current[k] == v)
    );
  }

  keys() {
    return Object.keys(this.#current);
  }

  map(f) {
    return (mapped = Object.fromEntries(this.entries().map(f)));
  }

  match(other) {
    other = this.#convert(other);
    return Object.keys(this.difference(other)).length === 0;
  }

  reset(value) {
    this.update(this.entries().map(([k, v]) => [k, value]));
    return this;
  }

  size() {
    return Object.keys(this.#current).length;
  }

  update(updates = {}, detail) {
    updates = this.#convert(updates);

   

    if (this.condition && !this.condition.call(this, updates, detail, this)) {
      return this;
    }

    if (this.transformer) {
      updates = this.transformer.call(this, updates, detail, this);
    }

    const difference = this.difference(updates);
    if (Object.keys(this.difference(difference)).length) {
      this.#previous = { ...this.#current };
      const current = {};
      const previous = {};
      for (const [k, v] of Object.entries(difference)) {
        previous[k] = this.#current[k];
        current[k] = v;
        if (v === undefined) {
          delete this.#current[k];
        } else {
          this.#current[k] = v;
        }
      }
      if (this.effects.size()) {
        this.#effects.call({
          current: Object.freeze(current),
          detail,
          previous: Object.freeze(previous),
        });
      }
    }
    return this;
  }

  values() {
    return Object.values(this.#current);
  }

  #convert(other) {
    if (Array.isArray(other)) {
      other = Object.fromEntries(other);
    } else if (other instanceof Type) {
      other = other.current;
    }
    return other;
  }
}

class Effects {
  #owner;
  #registry = new Map();

  constructor(owner) {
    this.#owner = owner;
  }

  add(effect, condition, run = true) {
    if (typeof condition !== "function") {
      if (typeof condition === "string") {
        const requirement = condition;
        condition = ({ current }) => requirement in current;
      } else if (Array.isArray(condition)) {
        const requirement = condition;
        condition = ({ current }) => requirement.some((key) => key in current);
      } else if (typeof condition === "object" && condition !== null) {
        const required_key = Object.keys(condition)[0];
        const required_value = Object.values(condition)[0];
        condition = ({ current }) => current[required_key] === required_value;
      }
    }

    this.#registry.set(effect, condition);

    if (run) {
      const change = {
        current: this.#owner.current,
        detail: this.#owner.detail,
        effect,
        index: null,
        owner: this.#owner,
        previous: this.#owner.previous,
      };

      if (!condition || condition(change)) {
        effect.call(this.#owner, change);
      }
    }
    return effect;
  }

  append(effect) {
    this.add(effect, null, null)
    return this.#owner || this
  }

  call({ current, previous, detail }) {
    this.#registry.entries().forEach(([effect, condition], index) => {
      const change = {
        current,
        effect,
        index,
        owner: this.#owner,
        previous,
        detail,
      };

      if (!condition || condition(change)) {
        effect.call(this.#owner, change);
      }
    });
    return this;
  }

  has(effect) {
    return this.#registry.has(effect);
  }

  remove(effect) {
    this.#registry.delete(effect);
    return this;
  }

  size() {
    return this.#registry.size;
  }
}
