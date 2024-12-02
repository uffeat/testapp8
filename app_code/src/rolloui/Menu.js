import { create } from "rollo/component";

export function Menu(updates = {}, ...hooks) {
  return create(
    "menu.d-flex",
    { 
      attribute_constructorName: "Menu",
      ...updates
  },
    ...hooks
  );
}
