import "rolloui/form/form.css";
import { create } from "rollo/component";
import { mixin } from "rollo/utils/mixin";
import { Cancel as CancelIcon } from "rolloui/icons/Cancel";
import { Upload as SelectIcon } from "rolloui/icons/Upload";
import { ErrorFeedback } from "rolloui/form/ErrorFeedback";
import { Floating } from "rolloui/form/Floating";
import { InputGroup } from "rolloui/form/InputGroup";
import { create_id } from "rolloui/form/utils/create_id";




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
  ...children
) {
  /* Prepare tree */
  const file_input = create("input", {
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
  const error_feedback = ErrorFeedback({}, file_input);
  const select_trigger = SelectTrigger({}, file_input);
  const clear_trigger = create(
    "button.btn.btn-outline-secondary",
    {},
    CancelIcon({ size: 24 })
  );
  const selection_display = SelectionDisplay(
    {
      floating,
      placeholder,
    },
    file_input
  );
  const input_group = InputGroup(
    {},
    select_trigger,
    floating ? Floating({ label }, selection_display) : selection_display,
    clear_trigger
  );
  /* Protect state */
  const set_value = file_input.reactive.protected.add("value");
  const set_error = file_input.reactive.protected.add("error");
  /* Handler: selected file(s) -> value state */
  file_input.on.change = (event) => {
    if (file_input.multiple) {
      set_value(file_input.files.length > 0 ? [...file_input.files] : null);
    } else {
      set_value(file_input.files.length > 0 ? file_input.files[0] : null);
    }
  };
  /* Effect: value state -> error state */
  file_input.effects.add((data) => {
    if (file_input.required) {
      set_error(!file_input.$.value ? "Required" : null);
    }
  }, "value");
  /* Handler: Reset value state */
  clear_trigger.on.click = (event) => {
    event.preventDefault();
    set_value(null);
  };
  /* Build tree */
  const self = create(
    "section",
    { attr_constructorName: "FileInput", ...updates },
    label && !floating ? Label({ text: label }, file_input) : undefined,
    input_group,
    error_feedback,
    file_input,
    ...children
  );
  /* Provide external API */
  mixin(
    file_input,
    class {
      get value() {
        return file_input.$.value;
      }
    }.prototype
  );

  return self;
}

function Label({ text }, input_element) {
  const self = create(
    "label.form-label.btn.p-0.mb-1",
    { attr_tabindex: "0", text }
  );
  if (!input_element.id) {
    input_element.id = create_id();
  }
  self.attribute.for = input_element.id;

  /* Handler to set visited state */
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

function SelectionDisplay({ floating, placeholder }, file_input) {
  const self = create("input.form-control", {
    attr_ariaLive: "polite",
    inert: true,
  });

  /* Effect: value state -> selection display */
  file_input.effects.add((data) => {
    if (file_input.multiple) {
      if (file_input.$.value) {
        if (file_input.$.value.length === 1) {
          self.value = file_input.$.value[0].name;
        } else {
          self.value = `${file_input.$.value.length} files selected`;
        }
      } else {
        self.value = floating ? null : placeholder;
      }
    } else {
      const value = floating ? null : placeholder;
      self.value = file_input.$.value ? file_input.$.value.name : value;
    }
  }, "value");
  /* Effect: error & visited state -> feedback style */
  file_input.effects.add(
    (data) => {
      self.css["is-invalid"] = file_input.$.error && file_input.$.visited;
    },
    ["error", "visited"]
  );

  return self;
}

function SelectTrigger(_, file_input) {
  const self = create("button.btn.btn-outline-secondary", {}, SelectIcon());
  /* Add handler to open file selector */
  self.on.click = (event) => {
    event.preventDefault();
    file_input.click();
  };
  /* Add handler to set data_visited state */
  /* Blur happens, when file selector opens; therefore flag needed to determine,
  if file selector has been opened previously . */
  let visited;
  const on_blur = (event) => {
    if (visited) {
      file_input.$.visited = true;
      self.removeEventListener("blur", on_blur);
    }
    visited = true;
  };
  self.on.blur = on_blur;

  return self;
}
