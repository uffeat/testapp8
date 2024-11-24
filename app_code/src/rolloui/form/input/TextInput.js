import { create } from "rollo/component";
import { mixin } from "rollo/utils/mixin";
import { base } from "rolloui/form/input/base";


/* Returns text-family input element or textarea. */
export function TextInput(
  {
    max,
    min,
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
  /* NOTE max/min not passed on as props */

  /* Inject validations */
  if (max) {
    function validate_max(value) {
      return value && value.length > max ? "Too long" : null;
    }
    if (validations) {
      validations = [validate_max, ...validations];
    } else {
      validations = [validate_max];
    }
  }
  if (min) {
    function validate_min(value) {
      return value && value.length < min ? "Too short" : null;
    }
    if (validations) {
      validations = [validate_min, ...validations];
    } else {
      validations = [validate_min];
    }
  }
  if (type === "email") {
    if (validations) {
      validations = [validate_email, ...validations];
    } else {
      validations = [validate_email];
    }
  }

  const self = base(
    {
      type,
      validations,
      $value: value,
      attr_constructorName: "TextInput",
      ...updates,
    },
    ...hooks
  );
  /* Protect value state */
  const set_value = self.reactive.protected.add("value");
  /* Handler: Update value state */
  self.on.input = (event) => {
    const trimmed = self.__super__.value.trim();
    set_value(trimmed ? trimmed : null);
  };
  /* Mixin for external API */
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
    }
  );

  return self;
}





function validate_email(value) {
  return value &&
    (value.length < 6 ||
      !value.includes(".") ||
      !create("input", { type: "email", value }).checkValidity())
    ? "Doesn't look like an email"
    : null;
}