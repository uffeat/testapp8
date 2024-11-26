import "rolloui/form/form.css";
import { create } from "rollo/component";

export function base(
  {
    attributes,
    css,
    required = false,
    type = "text",
    validations,
    $value = null,
    ...updates
  } = {},
  ...hooks
) {
  /* NOTE validations not passed on as prop item */
  const self = create(
    (() => {
      /* Component creation string factory */
      if (
        [
          "date",
          "datetime-local",
          "email",
          "file",
          "number",
          "password",
          "text",
        ].includes(type)
      ) {
        return "input.form-control";
      } else if (["checkbox", "radio"].includes(type)) {
        return "input.form-check-input";
      } else if (type === "textarea") {
        return "textarea.form-control";
      } else if (type === "select") {
        return "select.form-select";
      } else {
        throw new Error(`Unsupported type: ${type}`);
      }
    })(),
    {
      attributes,
      css,
      required,
      /* Take into account that native select and textarea do not have a type prop */
      type: ["select", "textarea"].includes(type) ? undefined : type,
      $error: null,
      $visited: false,
      $value,
      ...updates,
    },
    ...hooks
  );
  /* Protect error and visited states */
  const set_error = self.reactive.protected.add("error");
  const set_visited = self.reactive.protected.add("visited");
  /* Effect: Error & visited states -> "is-invalid" css class */
  self.effects.add(
    (data) => {
      self.css["is-invalid"] = self.$.error && self.$.visited;
    },
    ["error", "visited"]
  );
  /* Effect: Error state -> custom validity */
  self.effects.add((data) => {
    self.setCustomValidity(self.$.error ? " " : "");
  }, "error");
  /* Effect: Value state -> error state re required */
  self.effects.add((data) => {
    if (self.required) {
      set_error(self.$.value === null ? "Required" : null);
    }
  }, "value");
  /* Effect: Validation result (other than required) -> error state */
  if (validations) {
    self.effects.add((data) => {
      /* Abort, if required and value state is null */
      if (self.required && self.$.value === null) return;
      /* Run validations in order. 
      error state is successively set to validation result.
      Validation aborts, once a truthy validation result (the error message)
      is received. */
      for (const validation of validations) {
        const message = validation.call(self, self.$.value);
        set_error(message);
        if (message) {
          break;
        }
      }
    }, "value");
  }
  /* One-time handler: Set visited state */
  const onblur = (event) => {
    set_visited(true);
    self.removeEventListener("blur", onblur);
  };
  self.on.blur = onblur;

  return self;
}
