import { create } from "rollo/component";

export function CloseButton({ style, ...updates } = {}, ...hooks) {
  const self = create(
    "button.btn-close",
    {
      attribute_constructorName: "CloseButton",
      attribute_ariaLabel: "close",
      ...updates,
    },
    ...hooks
  );
  /* Adapt the component to be used in container with the given style */
  if (style && ["danger", "primary", "secondary", "success"].includes(style)) {
    self.classList.add("btn-close-white");
  }
  return self;
}
