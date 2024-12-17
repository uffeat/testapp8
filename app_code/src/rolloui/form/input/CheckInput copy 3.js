import { create } from "rollo/component";
import { mirror } from "rolloui/utils/mirror";
import { mixin } from "rolloui/utils/mixin";
import { base } from "rolloui/form/input/base";
import { InvalidFeedback } from "@/rolloui/form/_InvalidFeedback";
import { create_id } from "rolloui/form/utils/create_id";



/* Returns checkbox-type input element with reactive type-aligned value prop.
Options for switch (toggle), label and invalid feedback (via required). */
export function CheckInput(
  { id, name, label, required = false, toggle = false, value, ...updates } = {},
  ...hooks
) {
  /* Prepare tree */
 

  const form_control = base({
    id,
    name,
    required,
    type: "checkbox",
    $value: value,
  });

  /* Handler to update value state */
  form_control.on.change = (event) => {
    form_control.$.value = form_control.checked ? true : null;
  };
  /* Effect: Value state -> checked */
  form_control.effects.add(() => {
    form_control.checked = form_control.$.value ? true : false;
  }, "value");

  



  const invalid_feedback = required
    ? InvalidFeedback({ form_control })
    : undefined;
  if (label) {
    label = create("label.form-check-label", {}, label);
    if (!form_control.id) {
      form_control.id = create_id();
    }
    label.attribute.for = form_control.id;
  }
  const form_check = create(
    `div.form-check${toggle ? ".form-switch" : ""}`,
    {
      role: toggle ? "switch" : undefined,
    },
    form_control,
    label
  );

  /* Build tree */
  const self = create(
    `div.d-flex.flex-column.align-items-start.row-gap-1`,
    {
      attribute_constructorName: "CheckInput",
    },
    form_check,
    invalid_feedback
  );

  /* External API */
  /*
  mixin(
    self,
    class {
      get value() {
        return form_control.$.value;
      }
      set value(value) {
        form_control.$.value = value ? true : false;
        form_control.checked = self.$.value;
      }
    }
  );
  */
  mirror(self, form_control, "name", "value");

  self.update(updates);
  self.call(...hooks);

  return self;
}
