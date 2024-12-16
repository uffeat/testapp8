import { create } from "rollo/component";
import { mirror } from "@/rolloui/utils/mirror";
import { mixin } from "@/rolloui/utils/mixin";
import { base } from "rolloui/form/input/base";
import { InvalidFeedback } from "rolloui/form/InvalidFeedback";
import { create_id } from "rolloui/form/utils/create_id";

/* Returns checkbox-type input element with reactive type-aligned value prop. 
Primarily intended for use as base. */
export function Check(updates = {}, ...hooks) {
  const self = base({
    attribute_constructorName: "Check",
    type: "checkbox",
  });
  /* Protect value state */
  const set_value = self.reactive.protected.add("value");
  /* Handler to update value state */
  self.on.change = (event) => {
    set_value(self.checked ? true : null);
  };
  /* Effect: Value state -> checked */
  self.effects.add((data) => {
    self.checked = self.$.value ? true : false;
  }, "value");
  /* Mixin for external API */
  mixin(
    self,
    class {
      get value() {
        return this.$.value;
      }
      set value(value) {
        set_value(value ? true : false);
        self.checked = self.$.value;
      }
    }
  );

  self.update(updates);
  self.call(...hooks);

  return self;
}

/* Returns checkbox-type input element with reactive type-aligned value prop.
Options for switch (toggle), label and invalid feedback (via required). */
export function CheckInput(
  {
    id,
    name,
    label,
    required = false,
    toggle = false,
    value,
    ...updates
  } = {},
  ...hooks
) {
  /* Prepare tree */
  const check = Check({ id, name, required, value });
  const invalid_feedback = required
    ? InvalidFeedback({ form_control: check })
    : undefined;
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
  /* Build tree */
  const self = create(
    `div.d-flex.flex-column.align-items-start.row-gap-1`,
    {
      attribute_constructorName: "CheckInput",
    },
    form_check,
    invalid_feedback
  );
  /* Mirror for external API */
  mirror(self, check, "name", "value");

  self.update(updates);
  self.call(...hooks);

  return self;
}
