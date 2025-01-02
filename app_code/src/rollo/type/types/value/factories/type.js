import { is_class } from "rollo/tools/type/is_class";
/* Implements 'type' getter. */
export const type = (parent, config, ...factories) => {
  return class extends parent {
    static name = "type";

    /* Returns type. */
    get type() {
      if (this.current === undefined) {
        return;
      }
      if (this.current === null) {
        return null;
      }
      if (["boolean", "number", "string"].includes[typeof this.current]) {
        return typeof this.current;
      }
      if (this.current.__type__) {
        return this.current.__type__;
      }
      if (Array.isArray(this.current)) {
        return "array";
      }
      if (is_class(this.current)) {
        return "class";
      }

      return typeof this.current;
    }
  };
};
