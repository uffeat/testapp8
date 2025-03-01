// import { Condition } from "@/rollo/type/types/reactive/value/tools/condition";
// const { Condition } = await import("@/rollo/type/types/reactive/value/tools/condition");

/* Returns condition function from short-hand. */
export class Condition {
  static create = (requirement, operator = "value") => {
    if (operator === "value") {
      if (Array.isArray(requirement)) {
        return ({ data: { current } }) =>
          requirement.some((value) => value === current);
      }
      return ({ data: { current } }) => requirement === current;
    }

    if (operator === "!value") {
      if (Array.isArray(requirement)) {
        return ({ data: { current } }) =>
          requirement.every((value) => value !== current);
      }
      return ({ data: { current } }) => requirement !== current;
    }

    if (operator === "type") {
      if (Array.isArray(requirement)) {
        return ({ data: { current } }) =>
          requirement.some((value) => value === typeof current);
      }
      return ({ data: { current } }) => requirement === typeof current;
    }

    if (operator === "!type") {
      if (Array.isArray(requirement)) {
        return ({ data: { current } }) =>
          requirement.every((value) => value !== typeof current);
      }
      return ({ data: { current } }) => requirement !== typeof current;
    }
    throw new Error(`Invalid operator: ${operator}`);
  };

  
}
