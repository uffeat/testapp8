import { create } from "rollo/component";
import { mixin } from "rollo/utils/mixin";
import { base } from "rolloui/form/input/base";
import { InvalidFeedback } from "rolloui/form/InvalidFeedback";
import { create_id } from "rolloui/form/utils/create_id";



/* Returns checkbox-type input element with reactive type-aligned value prop. 
Use as base for building more specialized components. */
export function Check({ value, ...updates }, ...hooks) {
  const self = base(
    {
      
      type: "checkbox",
      $value: value,
     
    },
    
   
  );

  const set_value = self.reactive.protected.add("value");

  /* Add handler that updates value state */
  self.on.change = (event) => {
    set_value(self.checked ? true : null)
  };
  /* Add effect to set checked from value state */
  self.effects.add((data) => {
    self.checked = self.$.value ? true : false;
  }, "value");

  self.update(updates)
  self.call(...hooks)

  return self
}

/* Returns checkbox-type input element with reactive type-aligned value prop.
Options for switch, label and error feedback. */
export function CheckInput(
  { name, label, required = false, toggle = false, value, ...updates },
  ...hooks
) {
  const check = Check({ name, required, value });
  const error_feedback = required ? InvalidFeedback({form_control: check}) : undefined;

  if (label) {
    label = create("label.form-check-label", {}, label);
    if (!check.id) {
      check.id = create_id();
    }
    label.attribute.for = check.id;
  }

  const form_check = create(
    `div.form-check${toggle ? ".form-switch" : ""}`,
    {
      role: toggle ? "switch" : undefined,
    },
    check,
    label
  );

  return create(
    `div.d-flex.flex-column.align-items-start.row-gap-1`,
    updates,
    form_check,
    error_feedback,
    ...hooks
  );
}
