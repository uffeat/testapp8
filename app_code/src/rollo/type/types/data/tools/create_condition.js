import { type } from "rollo/type/type/type";

/* Creates and returns condition function from short-hand. */
export function create_condition(condition) {
  if (!condition || typeof condition === "function") {
    return condition;
  }

  if (typeof condition === "string") {
    /* Create condition function from string short-hand:
    current must contain a key corresponding to the string short-hand. */
    return ({data: {current}}) => condition in current;
  }

  if (Array.isArray(condition)) {
    /* Create condition function from array short-hand:
    current must contain a key that is present in the array short-hand. */
    return ({data: {current}}) => {

      for (const key of condition) {
        if (key in current) return true;
      }
      return false;
    };
  }

  /* TODO
  - Add 'all': current must contain all keys...
  - Add 'none': current cannot contain any of the keys...
  */

  if (typeof condition === "object" && Object.keys(condition).length === 1) {
    /* Create condition function from single-item object short-hand:
    current must contain a key-value pair corresponding to the object short-hand. */
    return ({data: {current}}) =>
      type.create("data", { ...current }).includes(condition);
  }

  throw new Error(`Invalid condition: ${condition}`);
}