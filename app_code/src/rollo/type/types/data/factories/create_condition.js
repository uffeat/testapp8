import { create_condition as _create_condition } from "rollo/type/types/data/tools/create_condition";

/* Implements create_condition method. */
export const create_condition = (parent, config, ...factories) => {
  return class extends parent {
    static name = "create_condition";
    create_condition(condition) {
      return _create_condition(condition);
    }
  };
};
