import { create } from "rollo/component";

export function Text(arg, updates = {}, text) {
  return typeof text === "string" ? create(arg, updates, text) : text
}