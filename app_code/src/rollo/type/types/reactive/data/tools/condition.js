// import { Condition } from "@/rollo/type/types/reactive/data/tools/condition";
// const { Condition } = await import("@/rollo/type/types/reactive/data/tools/condition");

/* Returns condition function from short-hand. */
export class Condition {
  static create = (requirement, operator = "has") => {
    if (operator === "has") {
      if (Array.isArray(requirement)) {
        return ({ data: { current } }) =>
          requirement.some((key) => key in current);
      }
      if (typeof requirement === "object") {
        const _key = Object.keys(requirement)[0];
        const _value = Object.values(requirement)[0];
        return ({ data: { current } }) => current[_key] === _value;
      }
      if (typeof requirement === "string") {
        return ({ data: { current } }) => requirement in current;
      }
      console.error("requirement:", requirement);
      throw new Error(`Invalid requirement`);
    }
    throw new Error(`Invalid operator: ${operator}`);
  };
}
