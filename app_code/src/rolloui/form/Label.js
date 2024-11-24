import { create } from "rollo/component";
import { mixin } from "rollo/utils/mixin";
import { create_id } from "rolloui/form/utils/create_id";

/* Returns non-container label component for use with form control. */
export function Label(updates = {}, ...hooks) {
  const self = create("label.form-label", {
    attr_constructorName: "Label",
  });

  mixin(
    self,
    class {
      get form_control() {
        return this._form_control;
      }
      set form_control(form_control) {
        if (this._form_control) {
          throw new Error(`Component already connected to form control.`);
        }

        if (!form_control.id) {
          form_control.id = create_id();
        }
        this.attribute.for = form_control.id;
        this._form_control = form_control;
      }

      get for_name() {
        if (this.form_control) {
          return this.form_control.name;
        }
      }

      set for_name(for_name) {
        /* Since component likely does not yet reside in a form at construction,
        look for form in task */
        setTimeout(() => {
          const form = self.closest("form");
          if (!form) {
            throw new Error(`Component should reside in a form.`);
          }
          const form_control = form.querySelector(`*[name="${for_name}"]`);
          if (!form_control) {
            throw new Error(
              `Could not find form control with name: ${for_name}.`
            );
          }
          this.form_control = form_control;
        }, 0);
      }
    }.prototype
  );

  self.update(updates);
  self.call(...hooks);

  return self;
}
