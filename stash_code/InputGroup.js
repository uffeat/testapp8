import { create } from "rollo/component";

export function InputGroup(updates = {}, ...hooks) {
  
  const self = create("div.input-group", updates, ...hooks)
  
  return self;
}