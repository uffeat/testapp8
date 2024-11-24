import { create } from "rollo/component";

export function InputGroup(updates = {}, ...hooks) {
  return create("div.input-group", updates, ...hooks);
}