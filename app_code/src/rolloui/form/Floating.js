import { create } from "rollo/component";
import { Label } from "rolloui/form/Label";
import { create_id } from "rolloui/form/utils/create_id";

export function Floating({ label, ...updates }, form_control, ...children) {
  if (!label) {
    throw new Error(`No label provided.`);
  }

  
  form_control.placeholder = label;
  const label_component = Label({}, label);
  if (!form_control.id) {
    form_control.id = create_id();
  }
  label_component.attribute.for = form_control.id;

  self = create(
    "div.form-floating",
    { attr_constructorName: "Floating", ...updates },
    form_control,
    label_component,
    ...children
  );

  return self;
}
