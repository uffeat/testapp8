import { create } from "rollo/component";
import { mixin } from "rolloui/utils/mixin";
import { base } from "rolloui/form/input/base";

/* Returns select component. */
export function Select(
  { placeholder, validations, value = null, ...updates } = {},
  ...hooks
) {
  const options = hooks.filter((hook) => Array.isArray(hook))
  hooks = hooks.filter((hook) => typeof hook === 'function')


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
  }, ...hooks);

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
  self.effects.add(() => {
    option_elements.forEach((element) => {
      element.attribute.selected =
        self.$.value !== null && self.$.value === element.attribute.value;
    });
  }, "value");
  /* Effect: Value state -> placeholder */
  self.effects.add(() => {
    placeholder_element.text = self.$.value === null ? placeholder : "";
  }, "value");
  /* Effect: Check value state */
  self.effects.add(() => {
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
        self.$.value = element.attribute.value;
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
        this.$.value = value;
      }
    }
  );

  self.append(...option_elements);

  return self;
}
