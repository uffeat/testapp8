import { create } from "rollo/component";

export function Menu({ attributes = {}, css, ...updates } = {}, ...hooks) {
  return create(
    "menu.d-flex",
    { attributes: { constructorName: "Menu", ...attributes }, css, ...updates },
    ...hooks
  );
}
