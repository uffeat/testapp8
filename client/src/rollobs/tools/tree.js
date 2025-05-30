/*
const { Tree } = await use("@/rollobs/tools/tree.js");
20250530
v.1.0
*/

const { component } = await use("@/rollocomponent/");

export class Tree {
  #_ = {
    cache: new Map(),
    registry: new Map(),
    conainer: component.div(),
  };

  constructor(...children) {
    this.append(...children)

  }

  get children() {
    return this.#_.conainer.children;
  }

  append(...children) {
    this.#_.conainer.append(...children);
    children.forEach((child) => {
      if (child.key) {
        this.#_.registry.set(child.key, child);
      }
    });
  }

  get(key) {
    if (this.#_.cache.has(key)) return this.#_.cache.get(key)
    const component = this.#_.conainer.querySelector(`[key="${key}"]`);
    if (!component) {
          throw new Error(`Component with key '${key}' not found.`);
        }
    this.#_.cache.set(key, component)
    return component
  }
};

