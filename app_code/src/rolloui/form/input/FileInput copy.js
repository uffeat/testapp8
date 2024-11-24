import "rolloui/form/form.css";
import { create } from "rollo/component";
import { mirror } from "rollo/utils/mirror";
import { mixin } from "rollo/utils/mixin";
import { Cancel as CancelIcon } from "rolloui/icons/Cancel";
import { Upload as SelectIcon } from "rolloui/icons/Upload";
import { Floating } from "rolloui/form/Floating";
import { InvalidFeedback } from "rolloui/form/InvalidFeedback";
import { Label as _Label } from "rolloui/form/Label";
import { create_id } from "rolloui/form/utils/create_id";


// TODO check where natives can be used

export function FileInput(
  {
    accept,
    floating = false,
    id,
    label = null,
    multiple = false,
    name,
    placeholder = "No file selected",
    required = false,
    ...updates
  } = {},
  ...hooks
) {
  /* Prepare tree */
  const form_control = create("input", {
    accept,
    display: "none",
    id,
    multiple,
    name,
    required,
    type: "file",
    $error: null,
    $visited: false,
    $value: null,
  });
  const error_feedback = InvalidFeedback({form_control}, );
  const select_trigger = SelectTrigger({}, form_control);
  const clear_trigger = create(
    "BUTTON.btn.btn-outline-secondary",
    {},
    CancelIcon({ size: 24 })
  );
  const selection_display = SelectionDisplay(
    {
      floating,
      placeholder,
    },
    form_control
  );
  const input_group = create("DIV.input-group",
    {},
    select_trigger,
    floating ? Floating({ label }, selection_display) : selection_display,
    clear_trigger
  );
  /* Protect state */
  const set_value = form_control.reactive.protected.add("value");
  const set_error = form_control.reactive.protected.add("error");
  /* Handler: selected file(s) -> value state */
  form_control.on.change = (event) => {
    if (form_control.multiple) {
      set_value(form_control.files.length > 0 ? [...form_control.files] : null);
    } else {
      set_value(form_control.files.length > 0 ? form_control.files[0] : null);
    }
  };
  /* Effect: value state -> error state */
  form_control.effects.add((data) => {
    if (form_control.required) {
      set_error(!form_control.$.value ? "Required" : null);
    }
  }, "value");
  /* Handler: Reset value state */
  clear_trigger.onclick = (event) => {
    event.preventDefault();
    set_value(null);
  };
  /* Build tree */
  const self = create(
    "section",
    { attr_constructorName: "FileInput", ...updates },
    label && !floating ? Label({ text: label }, form_control) : undefined,
    input_group,
    error_feedback,
    form_control,
    ...hooks
  );
  /* Mixin for external API */
  mixin(
    form_control,
    class {
      get value() {
        return form_control.$.value;
      }
    }
  );
  /* Mirror for external API */
  mirror(self, form_control, "name");

  return self;
}

// TODO Use Label as base
function Label({ text }, input_element) {
  const self = create(
    "label.form-label.btn.p-0.mb-1",
    { attr_tabindex: "0", text }
  );
  if (!input_element.id) {
    input_element.id = create_id();
  }
  self.attribute.for = input_element.id;

  /* One-time handler: Set visited state */
  let visited;
  /* Blur happens, when file selector opens; therefore flag needed to determine,
  if file selector has been opened previously . */
  const on_blur = (event) => {
    if (visited) {
      input_element.$.visited = true;
      self.removeEventListener("blur", on_blur);
    }
    visited = true;
  };
  self.on.blur = on_blur;
  return self;
}

function SelectionDisplay({ floating, placeholder }, form_control) {
  const self = create("input.form-control", {
    attr_ariaLive: "polite",
    inert: true,
  });
  /* Effect: value state -> selection display */
  form_control.effects.add((data) => {
    if (form_control.multiple) {
      if (form_control.$.value) {
        if (form_control.$.value.length === 1) {
          self.value = form_control.$.value[0].name;
        } else {
          self.value = `${form_control.$.value.length} files selected`;
        }
      } else {
        self.value = floating ? null : placeholder;
      }
    } else {
      const value = floating ? null : placeholder;
      self.value = form_control.$.value ? form_control.$.value.name : value;
    }
  }, "value");
  /* Effect: error & visited state -> feedback style */
  form_control.effects.add(
    (data) => {
      self.css["is-invalid"] = form_control.$.error && form_control.$.visited;
    },
    ["error", "visited"]
  );

  return self;
}


function SelectTrigger(_, form_control) {
  const self = create("BUTTON.btn.btn-outline-secondary", {}, SelectIcon());
  /* Add handler to open file selector */
  self.onclick = (event) => {
    event.preventDefault();
    form_control.click();
  };
  /* One-time handler: Set visited state */
  let visited;
  /* Blur happens, when file selector opens; therefore flag needed to determine,
  if file selector has been opened previously . */
  const on_blur = (event) => {
    if (visited) {
      form_control.$.visited = true;
      self.removeEventListener("blur", on_blur);
    }
    visited = true;
  };
  self.onblur = on_blur;

  return self;
}
