/*
import { Icon } from "@/rollocomponent/icon.js";
20250622
v.1.0
*/

import { author } from "@/rollocomponent/tools/author.js";
import { base } from "@/rollocomponent/tools/base.js";

export const Icon = author(
  class extends base() {
    static __key__ = "rollo-icon";

    #_ = {};

    get color() {
      return this.#_.color;
    }

    set color(color) {
      this.#_.svg.style.fill = this.#_.color = this.attribute.color = color;
    }

    get name() {
      return this.#_.name || null;
    }

    get size() {
      return this.#_.size
    }

    set size(size) {
      this.#_.size = this.attribute.size = size
      this.#_.svg.setAttribute("width", size);
      this.#_.svg.setAttribute("height", size);
    }

    update(updates = {}) {
      if (!updates.__html__) {
        throw new Error(`'__html__' not provided.`)
      }
      this.innerHTML = updates.__html__;
      this.#_.svg = this.find(`svg`);
      if (updates.__name__) {
        this.#_.name = this.attribute.name = updates.__name__
      }
      super.update?.(updates);
      return this;
    }
  }
);
