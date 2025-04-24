/* 
20250302 
src/rollo/component/component.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/component.js
import { Component, component } from "rollo/component/component.js";
const { Component, component } = await import("rollo/component/component.js");
*/

import { is_callable } from "rollo/tools/is/is_callable.js";

import { author } from "rollo/component/tools/author.js";
import { parse } from "rollo/component/tools/parse.js";
import { registry } from "rollo/component/tools/registry.js";

/* Returns component instance. 
NOTE
- Proxy-based version of Component (syntactical alternative) */
export const component = new Proxy(
  {},
  {
    get: (target, tag) => {
      tag = tag.replaceAll("_", "-");
      return (...args) => {
        const css_classes = args
          .filter((a, i) => !i && typeof a === "string")
          .join(".");
        return Component(
          `${tag}${css_classes ? "." + css_classes : ""}`,
          ...args.filter((a, i) => typeof a === "object" || i)
        );
      };
    },
  }
);

/* Returns component instance with option for rich in-line configuration.
NOTE
- Authors and registers native "base components" on-demand. */
export function Component(arg, ...args) {
  const [tag] = arg.split(".");
  let constructor = registry.get(tag);
  if (!constructor) {
    constructor = author(tag);
  }
  const parsed = parse(arg, ...args);
  const self = new constructor();
  self.__new__?.();
  self.update?.(parsed.updates);

  if (parsed.css_classes) {
    self.classList.add(...parsed.css_classes);
  }
  self.append(...parsed.children);

  /* NOTE Handle 'parent' separately because:
  - element may not support the custom 'parent' prop
  - in some cases, it's important to append to parent AFTER other props has been set. */
  if (parsed.parent) {
    if (parsed.parent !== self.parentElement) {
      parsed.parent.append(self);
    }
  }

  const deferred = [];
  parsed.hooks.forEach((h) => {
    const result = h.call(self, self);
    if (is_callable(result)) {
      deferred.push(result);
    }
  });
  deferred.forEach((h) => {
    setTimeout(() => {
      h.call(self, self);
    }, 0);
  });

  const substitute = self.__init__?.();
  if (substitute) {
    return substitute
  }

  return self;
}
