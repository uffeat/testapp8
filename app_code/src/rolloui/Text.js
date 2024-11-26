import { create } from "rollo/component";

export function Text(arg, kwargs = {}, text) {
  return typeof text === "string" ? create(arg, kwargs, text) : text
}