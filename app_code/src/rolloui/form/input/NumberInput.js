import { create } from "rollo/component";
import { mixin } from "@/rolloui/utils/mixin";
import { base } from "rolloui/form/input/base";

/* Returns number-type input element. */
export function NumberInput(
  {
    max,
    min,
    validations,
    value = null,
    ...updates
  } = {},
  ...hooks
) {
  /* NOTE max/min not passed on as props */

  /* Inject validations */
  if (max) {
    function validate_max(value) {
      return value !== null && value > max ? "Too high" : null;
    }
    if (validations) {
      validations = [validate_max, ...validations];
    } else {
      validations = [validate_max];
    }
  }
  if (min) {
    function validate_min(value) {
      return value !== null && value < min ? "Too low" : null;
    }
    if (validations) {
      validations = [validate_min, ...validations];
    } else {
      validations = [validate_min];
    }
  }

  const self = base(
    {
      attribute_constructorName: "NumberInput",
      type: "text",
      validations,
      $value: value,
      ...updates,
    },
    ...hooks
  );
  /* Protect value state */
  const set_value = self.reactive.protected.add("value");
  /* Handler: Update value state */
  self.on.input = (event) => {
    self.__super__.value = self.__super__.value.trim();
    if (self.__super__.value === "") {
      set_value(null);
    } else {
      /* Filter to number text */
      self.__super__.value = to_number_text(self.__super__.value);
      const number = Number(self.__super__.value.replaceAll(",", "."));
      if (typeof number === "number" && number === number) {
        set_value(number);
      } else {
        set_value(null);
      }
    }
  };
  /* Create external API */
  mixin(
    self,
    class {
      get value() {
        return this.$.value;
      }
      set value(value) {
        if (value !== null) {
          const number = Number(value);
          if (!(typeof number === "number" && number === number)) {
            throw new Error(`'${value}' is not a number.`);
          }
        }
        set_value(value);
        this.__super__.value = this.$.value;
      }
    }
  );

  return self;
}

/* Returns 'value' converted to a string that can be converted to number. */
function to_number_text(value) {
  let decimal = false;
  return value
    .split("")
    .filter((c, i) => {
      if (c === "-" && i === 0) return true;
      if ((c === "." || c === ",") && !decimal) {
        decimal = true;
        return true;
      }
      return c >= "0" && c <= "9";
    })
    .join("");
}
