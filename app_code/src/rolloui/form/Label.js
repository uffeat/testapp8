import { create } from "rollo/component";
import { create_id } from "rolloui/form/utils/create_id";

/* Returns non-container label component for use with form control. */
export function Label({ for_name, ...updates } = {}, ...children) {
  const self = create(
    "label.form-label",
    {
      attr_constructorName: "Label",
      ...updates,
    },
    ...children
  );

  if (for_name) {
    self.effects.add(
      (data) => {
        const form = self.closest("form");
        if (!form) {
          throw new Error(`Label components should reside in a form.`);
        }
        /* Since the form control may connect after the Label, look for it in a task  */
        setTimeout(() => {
          const form_control = form.querySelector(`*[name="${for_name}"]`);
          if (!form_control) {
            throw new Error(
              `Could not find form control with name: ${for_name}.`
            );
          }
          connect(self, form_control);
        }, 0);
      },
      { connected: true }
    );
  }

  return self;
}

/* Connects label component to form control. */
export function connect(label_component, form_control) {
  if (!form_control.id) {
    form_control.id = create_id();
  }
  label_component.attribute.for = form_control.id;
  return [label_component, form_control];
}
