/*
const { Tree } = await use("@/rollobs/tools/tree.js");
20250530
v.1.0
*/



export class Tree extends HTMLElement {
  #_ = {
    registry: new Map(),
  };

  constructor() {
    super();
  }

  append(...components) {
    super.append(...components)
    // TODO Add to registry
    return this
  }

  components() {
    return this.#_.registry.values()
  }

  get(key) {
    return this.#_.registry.get(key);
  }
}

const tag = 'rollo-tree'
 customElements.define(tag, Tree);
    if (import.meta.env.DEV) {
      console.info("Registered component with tag:", tag);
    }