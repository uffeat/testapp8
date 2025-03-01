//import { Component, component } from "@/rollo/component/component";
//const { Component, component } = await import("@/rollo/component/component");

import { author } from "@/rollo/component/tools/author";
import { parse } from "@/rollo/component/tools/parse";
import { registry } from "./tools/registry";

/* Returns component instance. */
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

/* Returns component instance. */
export function Component(arg, ...args) {
  const [tag] = arg.split(".");
  let constructor = registry.get(tag);
  if (!constructor) {
    constructor = author(tag);
  }
  const parsed = parse(arg, ...args);
  const element = new constructor(parsed.__config__);
  element.__new__ && element.__new__();
  element.update && element.update(parsed.updates);

  if (parsed.css_classes) {
    element.classList.add(...parsed.css_classes);
  }
  element.append(...parsed.children);

  if (parsed.parent) {
    if (parsed.parent !== element.parentElement) {
      parsed.parent.append(element)
    }
  }


  parsed.hooks.forEach((h) => h.call(element, element));
  return element;
}
