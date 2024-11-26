import { create } from "rollo/component";

export function Menu({ css, ...updates } = {}, ...hooks) {
  return create("menu.d-flex", { css, ...updates }, ...hooks);
}
