/*
import { component } from "@/rollocomponent/component.js";
20250602
v.2.0
*/

import { factory } from "@/rollocomponent/tools/factory.js";
import { mix } from "@/rollocomponent/tools/mix.js";
import { mixins } from "@/rollocomponent/mixins/__init__.js";
import { registry } from "@/rollocomponent/tools/registry.js";

const get = (tag) => {
  const key = `x-${tag}`;

  if (registry.has(key)) {
    return registry.get(key);
  }

  const ref = document.createElement(tag);
  const base = ref.constructor;
  if (base === HTMLUnknownElement) {
    throw new Error(`'${tag}' is not native.`);
  }

  const _mixins = [
    mixins.append,
    mixins.attrs,
    mixins.classes,
    mixins.clear,
    mixins.components,
    mixins.connect,
    mixins.effect,
    mixins.find,
    mixins.handlers,
    mixins.hooks,
    mixins.host,
    mixins.insert,
    mixins.key,
    mixins.parent,
    mixins.props,
    mixins.send,
    mixins.setup,
    mixins.state,
    mixins.style,
    mixins.super_,
    mixins.tab,
    mixins.vars,
  ];

  if ("textContent" in ref) {
    _mixins.push(mixins.text);
  }
  if (tag === "form") {
    _mixins.push(mixins.novalidation);
  }
  if (tag === "label") {
    _mixins.push(mixins.for_);
  }

  return registry.add(
    class extends mix(base, {}, ..._mixins) {
      static __key__ = key;
      static __native__ = tag;

      constructor() {
        super();
        this.setAttribute("web-component", "");
      }
    }
  );
};

/* Returns instance of basic non-autonomous web component. */
export const component = new Proxy(
  {},
  {
    get: (target, tag) => {
      return factory(get(tag));
    },
  }
);
