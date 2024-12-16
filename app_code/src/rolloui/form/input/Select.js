import { create } from "rollo/component";
import { mixin } from "@/rolloui/utils/mixin";
import { base } from "rolloui/form/input/base";

/* Returns select component. */
export function Select(
  { placeholder, validations, value = null, ...updates } = {},
  ...options
) {
  if (options.length === 0) {
    throw new Error(`No options provided.`);
  }
  if (updates.multiple) {
    throw new Error(`Component does not support multiple selections.`);
  }

  const self = base({
    attribute_constructorName: "Select",
    type: "select",
    validations,
    $value: value,
    ...updates,
  });

  /* Protect value state */
  const set_value = self.reactive.protected.add("value");

  /* Create option elements */
  const placeholder_element = create("option", {}, placeholder);
  /* NOTE placeholder_element.attribute.value is null */
  const option_elements = [
    placeholder_element,
    ...options.map(([text, value]) =>
      create("option", { value, _value: value }, text)
    ),
  ];
  /* Effect: Value state -> show selected option */
  self.effects.add((data) => {
    option_elements.forEach((element) => {
      element.attribute.selected =
        self.$.value !== null && self.$.value === element.attribute.value;
    });
  }, "value");
  /* Effect: Value state -> placeholder */
  self.effects.add((data) => {
    placeholder_element.text = self.$.value === null ? placeholder : "";
  }, "value");
  /* Effect: Check value state */
  self.effects.add((data) => {
    if (
      self.$.value !== null &&
      option_elements.filter(
        (element) => self.$.value === element.attribute.value
      ).length === 0
    ) {
      throw new Error(`Invalid value: ${self.$.value}`);
    }
  }, "value");
  /* Handler: Update value state */
  self.on.change = (event) => {
    for (const element of option_elements) {
      if (element.selected) {
        set_value(element.attribute.value);
        break;
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
        set_value(value);
      }
    }
  );

  self.append(...option_elements);

  return self;
}
