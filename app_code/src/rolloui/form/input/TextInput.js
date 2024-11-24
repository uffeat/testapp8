import { base } from "rolloui/form/input/base";
import { mixin } from "rollo/utils/mixin";

/* Returns text-family input element. Use for password- and text-type inputs */
export function TextInput(
  {
    max,
    min,
    name,
    required = false,
    type = "text",
    validations,
    value = null,
    ...updates
  } = {},
  ...hooks
) {
  if (!["email", "password", "text", "textarea"].includes(type)) {
    throw new Error(`Unsupported type: ${type}`);
  }
  /* NOTE Allow "email" and "textarea", so that the component can be 
  used as base for these more specialized components */
  /* NOTE max/min not passed on as props */

  /* Inject max validation into validations */
  if (max) {
    const validate_max = (value) =>
      value && value.length > max ? "Too long" : null;
    if (validations) {
      validations = [validate_max, ...validations];
    } else {
      validations = [validate_max];
    }
  }
  /* Inject min validation into validations */
  if (min) {
    const validate_min = (value) =>
      value && value.length < min ? "Too short" : null;
    if (validations) {
      validations = [validate_min, ...validations];
    } else {
      validations = [validate_min];
    }
  }
  const self = base(
    {
      name,
      required,
      type,
      validations,
      $value: value,
      attr_constructorName: "TextInput",
      ...updates,
    },
    ...hooks
  );

  const set_value = self.reactive.protected.add("value");

  /* Add handler that updates value state */
  self.on.input = (event) => {
    const trimmed = self.__super__.value.trim();
    set_value(trimmed ? trimmed : null);
  };

  /* Add mixin to provide external API */
  mixin(
    self,
    class {
      get value() {
        return this.$.value;
      }
      set value(value) {
        if (value !== null) {
          value = value.trim();
          if (value === "") {
            value = null;
          }
        }
        set_value(value);
        this.__super__.value = value;
      }
    }.prototype
  );

  return self;
}
