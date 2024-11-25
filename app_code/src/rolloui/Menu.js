import { create } from "rollo/component";
import { use_css } from "rollo/hooks/use_css";

export function Menu({ css, ...updates } = {}, ...hooks) {
  return create("menu.d-flex", updates, use_css(css), ...hooks);
}
