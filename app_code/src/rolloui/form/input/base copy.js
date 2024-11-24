import "rolloui/form/form.css";
import { create } from "rollo/component";
import { mixin } from "rollo/utils/mixin";

export function base(
  {
    name,
    required = false,
    type = "text",
    validations,
    $value = null,
    ...updates
  } = {},
  ...children
) {
  /* NOTE validations not passed on as prop item */
  const self = create(
    (() => {
      if (
        [
          "date",
          "datetime-local",
          "email",
          "file",
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
      name,
      required,
      /* Take into account that native select and textarea do not have a type prop */
      type: ["select", "textarea"].includes(type) ? undefined : type,
      $error: null,
      $visited: false,
      $value,
      ...updates,
    },
    ...children
  );

  const set_visited = self.reactive.protected.add("visited");
  const set_error = self.reactive.protected.add("error");

  /* Add effect to control "is-invalid" css class */
  self.effects.add(
    (data) => {
      self.css["is-invalid"] = self.$.error && self.$.visited;
    },
    ["error", "visited"]
  );

  /* Add effect to control custom validity */
  self.effects.add((data) => {
    self.setCustomValidity(self.$.error ? " " : "");
  }, "error");

  /* Add effect to set error state from required validation */
  self.effects.add((data) => {
    if (self.required) {
      set_error(self.$.value === null ? "Required" : null)
    }
  }, "value");

  /* Add effect to set error state from validations */
  if (validations) {
    self.effects.add((data) => {
      /* Abort, if required and value state is null */
      if (self.required && self.$.value === null) return;
      /* Run validations in order. 
      error state is successively set to validation result.
      Validation aborts, once a truthy validation result is received. */
      for (const validation of validations) {
        const message = validation.call(self, self.$.value);
        set_error(message)
        if (message) {
          break;
        }
      }
    }, "value");
  }

  /* Add handler to set visited state */
  const onblur = (event) => {
    set_visited(true)
    self.removeEventListener('blur', onblur)
  };
  self.on.blur = onblur;

  /* Add mixin to provide external API */
  mixin(
    self,
    class {
      get error() {
        return this.$.error;
      }
      get visited() {
        return this.$.visited;
      }
      
    }.prototype
  );

  return self;
}
