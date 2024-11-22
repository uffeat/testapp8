import { create } from "rollo/component";

export function CloseButton({ style, ...props }, ...children) {
  const component = create("button.btn-close", {attr_ariaLabel: "Close", ...props}, ...children);
  /* Adapt the component to be used in container with the given style */
  if (style && ["danger", "primary", "secondary", "success"].includes(style)) {
    component.classList.add("btn-close-white");
  }
  return component;
}
