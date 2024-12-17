import { create } from "rollo/component";
import { mixin } from "rolloui/utils/mixin";
import { create_id } from "rolloui/form/utils/create_id";

/* Returns non-container label component for use with form control. */
export function Label({ form_control, ...updates } = {}, ...hooks) {
  const self = create("label.form-label");

  if (form_control) {
    if (!form_control.id) {
      form_control.id = create_id();
    }
    self.attribute.for = form_control.id;
  } else {
    throw new Error(`Form control not provided.`);
  }

  self.update(updates);
  self.call(...hooks);

  return self;
}
