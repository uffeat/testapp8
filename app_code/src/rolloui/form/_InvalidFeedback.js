import { create } from "rollo/component";

/* Returns invalid feedback component for use with form control. */
export function InvalidFeedback({ form_control, ...updates } = {}, ...hooks) {
  const self = create("div.invalid-feedback", {
    attribute_ariaLive: "assertive",
  });

  if (form_control) {
    /* Effects: Error state -> feedback text */
    form_control.effects.add(() => {
      self.text = form_control.$.error;
    }, "error");
    /* Effect: Visited & value state -> feedback style */
    form_control.effects.add(() => {
      self.css_class.invisible =
        !form_control.$.visited &&
        !(form_control.required && !form_control.$.value);
      self.css_class.textSecondary =
        !form_control.$.visited &&
        form_control.required &&
        !form_control.$.value;
    }, ["visited", "value"]);
    /* Provide dom hint */
    self.attribute.forName = form_control.name;
  } else {
    throw new Error(`Form control not provided.`);
  }

  self.update(updates);
  self.call(...hooks);

  return self;
}
