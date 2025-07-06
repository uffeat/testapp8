/*
import { base } from "@/rollocomponent/tools/base.js";
20250615
v.1.0
*/

import { mix } from "@/rollocomponent/tools/mix.js";
import { mixins } from "@/rollocomponent/mixins/__init__.js";


export const base = (...args) => {
  const native = args.find((a) => typeof a === 'string') || null
  const __mixins = args.filter((a) => typeof a === 'function')

  const _mixins = [
    mixins.attrs,
    mixins.classes,
    mixins.clear,
    mixins.components,
    mixins.connect,
    mixins.detail,
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
    mixins.states,
    mixins.style,
    mixins.super_,
    mixins.tab,
    mixins.vars,
    ...__mixins,
  ];

  if (native) {
    const ref = document.createElement(native);
    const base = ref.constructor;
    if (base === HTMLUnknownElement) {
      native;
      throw new Error(`'${tag}' is not native.`);
    }
    if (is_shadow_ready(ref)) {
      _mixins.push(mixins.shadow);
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
      mixins.shadow,
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

function is_shadow_ready (element)  {
  try {
    element.attachShadow({ mode: "open" });
    return true
  } catch {
    return false
  }
}