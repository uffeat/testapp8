import { create } from "rollo/component";
import { mirror } from "rollo/utils/mirror";
import { Label } from "rolloui/form/Label";
import { create_id } from "rolloui/form/utils/create_id";

export function Floating(
  { attributes = {}, css, label, ...updates },
  form_control,
  ...hooks
) {
  if (!label) {
    throw new Error(`No label provided.`);
  }
  /* Set placeholder (required for floating) */
  form_control.placeholder = label;
  const label_component = Label({}, label);
  /* Connect label and form control components */
  if (!form_control.id) {
    form_control.id = create_id();
  }
  label_component.attribute.for = form_control.id;
  /* Build tree */
  self = create(
    "div.form-floating",
    {
      attributes: {
        constructorName: "Floating",
        ...attributes,
      },
      css,
      ...updates,
    },
    form_control,
    label_component,
    ...hooks
  );
  /* Mirror for external API */
  mirror(self, form_control, "name", "value");

  return self;
}
