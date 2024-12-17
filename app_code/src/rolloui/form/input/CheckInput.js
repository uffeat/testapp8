import { create } from "rollo/component";
import { base } from "rolloui/form/input/base";
import { InvalidFeedback } from "rolloui/form/_InvalidFeedback";
import { Label } from "rolloui/form/_Label";

/* Returns checkbox-type input element with reactive type-aligned value state.
Options for switch (toggle), label and invalid feedback (via required). */
export function CheckInput(
  { id, name, label, required = false, toggle = false, value, ...updates } = {},
  ...hooks
) {
  /* Create form control */
  const form_control = base({
    id,
    name,
    required,
    type: "checkbox",
    $value: value,
  });

  /* Handler: Update value state */
  form_control.on.change = (event) => {
    form_control.$.value = form_control.checked ? true : null;
  };

  /* Effect: Value state -> checked */
  form_control.effects.add(() => {
    form_control.checked = form_control.$.value ? true : false;
  }, "value");

  /* Build tree */
  return create(
    `div.d-flex.flex-column.align-items-start.row-gap-0`,
    updates,
    create(
      `div.form-check${toggle ? ".form-switch.mb-0" : ""}`,
      { role: toggle ? "switch" : undefined },
      form_control,
      label ? Label({ form_control, text: label }) : undefined
    ),
    required ? InvalidFeedback({ form_control }, ".mt-0") : undefined,
    ...hooks
  );
}
