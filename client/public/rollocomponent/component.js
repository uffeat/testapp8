/*
import { component } from "@/rollocomponent/component.js";
*/

const { factory } = await use("/rollocomponent/tools/factory.js");
const { mix } = await use("/rollocomponent/tools/mix.js");
const { mixins } = await use("/rollocomponent/mixins/mixins.js");
const { registry } = await use("/rollocomponent/tools/registry.js");

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

  const _mixins = Object.entries(mixins)
    .filter(([name, mixin]) => !["for_", "novalidation", "text"].includes(name))
    .map(([name, mixin]) => mixin);

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
