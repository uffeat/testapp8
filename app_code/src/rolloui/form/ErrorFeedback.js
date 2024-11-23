import { create } from "rollo/component";

/* Returns error-feedback component for use with form control. */
export function ErrorFeedback({ for_name, ...updates } = {}, ...children) {
  const self = create(
    "div.invalid-feedback",
    {
      attr_ariaLive: "assertive",
      attr_constructorName: "ErrorFeedback",
      ...updates,
    },
    ...children
  );

  if (for_name) {
    self.effects.add(
      (data) => {
        const form = self.closest("form");
        if (!form) {
          throw new Error(`ErrorFeedback components should reside in a form.`);
        }
        const form_control = form.querySelector(`*[name="${for_name}"]`);
        if (!form_control) {
          throw new Error(
            `Could not find form control with name: ${for_name}.`
          );
        }
        connect(self, form_control);
        self.attribute.forName = for_name;
      },
      { connected: true }
    );
  }

  return self;
}

/* Connects error feedback to form control state. */
export function connect(error_feedback, form_control) {
  if (error_feedback._form_control) {
    throw new Error(
      `ErrorFeedback component already connected to form control.`
    );
  }
  error_feedback._form_control = form_control;

  /* Add effects to control feedback text */
  form_control.effects.add(
    (data) => {
      error_feedback.text = form_control.error;
    },
    ["error"]
  );

  /* Add effect to control feedback style */
  form_control.effects.add(
    (data) => {
      error_feedback.css.invisible =
        !form_control.visited &&
        !(form_control.required && !form_control.value);
      error_feedback.css["text-secondary"] =
        !form_control.visited && form_control.required && !form_control.value;
    },
    ["visited", "value"]
  );

  return [error_feedback, form_control];
}
