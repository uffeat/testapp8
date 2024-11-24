import { create } from "rollo/component";
import { mixin } from "rollo/utils/mixin";

/* Returns invalid feedback component for use with form control. */
export function InvalidFeedback(updates = {}, ...hooks) {
  const self = create("div.invalid-feedback", {
    attr_ariaLive: "assertive",
    attr_constructorName: "InvalidFeedback",
  });

  mixin(
    self,
    class {
      get form_control() {
        return this._form_control;
      }
      set form_control(form_control) {
        if (this._form_control) {
          throw new Error(
            `Component already connected to form control.`
          );
        }

        /* Add effects to control feedback text */
        form_control.effects.add(
          (data) => {
            this.text = form_control.$.error;
          },
          ["error"]
        );

        /* Add effect to control feedback style */
        form_control.effects.add(
          (data) => {
            this.invisible =
              !form_control.$.visited &&
              !(form_control.required && !form_control.$.value);
            this.soft =
              !form_control.$.visited &&
              form_control.required &&
              !form_control.$.value;
          },
          ["visited", "value"]
        );

        if (form_control.name) {
          this.attribute.forName = form_control.name;
        }
        this._form_control = form_control;
      }

      get for_name() {
        return this.attribute.forName;
      }

      set for_name(for_name) {
        /* Since component likely does not yet reside in a form at construction,
        look for form in task */
        setTimeout(() => {
          const form = self.closest("form");
          if (!form) {
            throw new Error(
              `Component should reside in a form.`
            );
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

      get invisible() {
        return this.css.invisible;
      }
      set invisible(invisible) {
        this.css.invisible = invisible;
      }

      get soft() {
        return this.css["text-secondary"];
      }
      set soft(soft) {
        this.css["text-secondary"] = soft;
      }
    }.prototype
  );

  self.update(updates);
  self.call(...hooks)

  return self;
}
