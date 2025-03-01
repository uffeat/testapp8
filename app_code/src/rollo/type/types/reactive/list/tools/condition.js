// import { Condition } from "@/rollo/type/types/reactive/list/tools/condition";
// const { Condition } = await import("@/rollo/type/types/reactive/list/tools/condition");

/* Returns condition function from short-hand. */
export class Condition {
  static create = (requirement, operator = "has") => {
    if (operator === "has") {
      if (Array.isArray(requirement)) {
        return ({ data: { added } }) =>
          requirement.some((v) => added.includes(v));
      }
      return ({ data: { added } }) => added.includes(requirement);
    }

    throw new Error(`Invalid operator: ${operator}`);
  };
}
