
import { component } from "rollo/component/component.js";

export const Error_ = (message) => {
  const self = component.div(component.h1({}, "Error"))

  if (message) {
    component.h3({parent: self}, message)
  }

  return self
};