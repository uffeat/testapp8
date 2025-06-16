/*
import { define } from "@/rollocomponent/tools/define.js";
20250605
v.1.0
*/

import { factory } from "@/rollocomponent/tools/factory.js";
import { registry } from "@/rollocomponent/tools/registry.js";
import { mix } from "@/rollocomponent/tools/mix.js";
import { mixins } from "@/rollocomponent/mixins/__init__.js";

/*  */
export const define = (spec) => {
  const _mixins = spec.mixins.map((name) => mixins[name]);

  const cls = class extends mix(HTMLElement, {}, ..._mixins) {
    static __new__ = function () {
      if (spec.tree) {
        const children = spec.tree();
        if (Array.isArray(children)) {
          this.append(...children);
        } else {
          this.append(children);
        }
      }
    };
    constructor() {
      super();
    }
  };

  return factory(registry.add(cls, spec.tag));
};
