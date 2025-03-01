// import { create, element, update } from "@/rollo/tools/element";
// const { create, element, update } = await import("@/rollo/tools/element");

import { parse } from "@/rollo/component/tools/parse";

/* Updates and returns element. */
export const update = (element, {parent, text,...updates} = {}) => {
  /* Update props */
  if (text) {
    element.textContent = text;
  }
  Object.entries(updates)
    .filter(([k, v]) => k in element)
    .forEach(([k, v]) => (element[k] = v));
  /* Update style props */
  Object.entries(updates)
    .filter(([k, v]) => k in element.style && !(k in element))
    .forEach(([k, v]) => (element.style[k] = v));
  /* Update attributes */
  Object.entries(updates)
    .filter(([k, v]) => !(k in element) && !k.startsWith("_"))
    .forEach(([k, v]) => {
      if (v === false || v === null) {
        element.removeAttribute(k);
      } else if (v === true) {
        element.setAttribute(k, "");
      } else if (typeof v === "string") {
        element.setAttribute(k, v);
      }
    });
  /* Append to parent */
  if (parent && parent !== element.parentElement) {
    parent.append(element);
  }
  return element;
};

export const create = (arg, ...args) => {
  const [tag] = arg.split(".");
  const element = document.createElement(tag);

  const parsed = parse(arg, ...args);
  update(element, {parent: parsed.parent, ...parsed.updates});

  if (parsed.css_classes) {
    element.classList.add(...parsed.css_classes);
  }
  element.append(...parsed.children);
  parsed.hooks.forEach((h) => h.call(element, element));
  /* Patch-on update */
  element.update = (...args) => update(element, ...args);
  return element;
};

export const element = new Proxy(
  {},
  {
    get: (target, tag) => {
      return (...args) => {
        const css_classes = args
          .filter((a, i) => !i && typeof a === "string")
          .join(".");
        return create(
          `${tag}${css_classes ? "." + css_classes : ""}`,
          ...args.filter((a, i) => typeof a === "object" || i)
        );
      };
    },
  }
);
