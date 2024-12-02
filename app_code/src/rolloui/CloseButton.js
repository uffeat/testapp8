import { create } from "rollo/component";

export function CloseButton({ attributes = {}, css, style, ...updates }, ...hooks) {
  const self = create("button.btn-close", {attributes: {ariaLabel: "close", ...attributes}, css, ...updates}, ...hooks);
  /* Adapt the component to be used in container with the given style */
  if (style && ["danger", "primary", "secondary", "success"].includes(style)) {
    self.classList.add("btn-close-white");
  }
  return self;
}



