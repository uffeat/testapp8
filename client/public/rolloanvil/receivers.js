export const Receivers = new (class {
  #_ = {
    registry: new Set(),
  };
  constructor() {
    window.addEventListener("message", async (event) => {
      if (event.origin !== meta.anvil.origin) {
        return;
      }
      if (!event.data.signal) {
        return;
      }
      if (!Receivers.size) {
        return;
      }
      for (const effect of this.effects()) {
        await effect(event.data.data);
      }
    });
  }

  /* */
  get size() {
    return this.#_.registry.size;
  }

  /* */
  add(effect) {
    this.#_.registry.add(effect);
    return effect;
  }

  /* */
  clear() {
    this.#_.registry.clear();
    return this;
  }

  /* */
  effects() {
    return this.#_.registry.values();
  }

  /* */
  remove(effect) {
    this.#_.registry.delete(effect);
    return this;
  }
})();