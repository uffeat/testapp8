/*
import { base } from "@/rollocomponent/tools/base.js";
20250615
v.1.0
*/


const { mix } = await use("/rollocomponent/tools/mix.js");


const { mixins } = await use("/rollocomponent/mixins/mixins.js");

const shadow = (await use("/rollocomponent/mixins/shadow.js")).default;



/* */
export const base = (...args) => {
  const native = args.find((a) => typeof a === "string") || null;
  const __mixins = args.filter((a) => typeof a === "function");

  const _mixins = Object.entries(mixins)
    .filter(
      ([name, mixin]) =>
        !["append", "for_", "novalidation", "text", "tree"].includes(name)
    )
    .map(([name, mixin]) => mixin);

  _mixins.push(...__mixins);

  if (native) {
    const ref = document.createElement(native);
    const base = ref.constructor;
    if (base === HTMLUnknownElement) {
      native;
      throw new Error(`'${tag}' is not native.`);
    }
    if (is_shadow_ready(ref)) {
      _mixins.push(shadow);
    } else {
      _mixins.push(mixins.append);
    }
    if ("textContent" in ref) {
      _mixins.push(mixins.text);
    }
    if (native === "form") {
      _mixins.push(mixins.novalidation);
    }
    if (native === "label") {
      _mixins.push(mixins.for_);
    }
    return class extends mix(base, {}, ..._mixins) {
      static __native__ = native;
      constructor() {
        super();
        this.setAttribute("web-component", "");
      }
    };
  } else {
    return class extends mix(
      HTMLElement,
      {},
      shadow,
      mixins.text,
      mixins.tree,
      ..._mixins
    ) {
      constructor() {
        super();
      }
    };
  }
};

function is_shadow_ready(element) {
  try {
    element.attachShadow({ mode: "open" });
    return true;
  } catch {
    return false;
  }
}
