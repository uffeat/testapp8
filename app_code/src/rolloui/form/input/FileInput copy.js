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
    label = null,
    multiple = false,
    name,
    placeholder = "No file selected",
    required = false,
    ...updates
  } = {},
  ...children
) {
  const file_control = FileControl({ accept, multiple, name, required });
  const error_feedback = ErrorFeedback(file_control);
  const select_trigger = SelectTrigger(file_control);
  const clear_trigger = ClearTrigger(file_control);
  const selection_display = SelectionDisplay(file_control, {
    floating,
    placeholder,
  });

  const input_group = InputGroup(
    {},
    select_trigger,
    floating ? Floating({ label }, selection_display) : selection_display,
    clear_trigger
  );
  return create(
    "section",
    updates,
    label && !floating ? Label(file_control, { text: label }) : undefined,
    input_group,
    error_feedback,
    file_control,
    ...children
  );
}

function ClearTrigger(file_input, updates = {}, ...children) {
  return create(
    "button.btn.btn-outline-secondary",
    updates,
    CancelIcon({ size: 24 }),
    function () {
      /* Add handler to reset file input value state */
      this.on.click = (event) => {
        event.preventDefault();
        file_input.$.value = null;
      };
    },
    ...children
  );
}

function FileControl(
  { accept, multiple = false, name, required = false, ...updates } = {},
  ...children
) {
  const self = create(
    "input",
    {
      accept,
      display: "none",
      multiple,
      name,
      required,
      type: "file",
      $error: null,
      $visited: false,
      $value: null,
      ...updates,
    },
    function () {
      /* Add handler to update value state from selected file(s) */
      this.on.change = (event) => {
        if (this.multiple) {
          this.$.value = this.files.length > 0 ? [...this.files] : null;
        } else {
          this.$.value = this.files.length > 0 ? this.files[0] : null;
        }
      };
      /* Add effect to update error state from value state */
      this.effects.add((data) => {
        if (this.required) {
          this.$.error = !this.$.value ? "Required" : null;
        }
      }, "value");
    },
    ...children
  );

  /* Add mixin to provide external API */
  mixin(
    self,
    class {
      get value() {
        return this.$.value;
      }
    }.prototype
  );

  return self;
}

function Label(input_element, updates = {}, ...children) {
  return create(
    /* HACK Style as btn to avoid focus outline */
    "label.form-label.btn.p-0.mb-1",
    { attr_tabindex: "0", ...updates },
    function () {
      if (!input_element.id) {
        input_element.id = create_id();
      }
      this.attribute.for = input_element.id;
      /* Add handler to set data_visited state */
      /* Blur happens, when file selector opens; therefore flag needed to determine,
      if file selector has been opened previously . */
      let visited;
      const on_blur = (event) => {
        if (visited) {
          input_element.$.visited = true;
          this.removeEventListener("blur", on_blur);
        }
        visited = true;
      };
      this.on.blur = on_blur;
    },
    ...children
  );
}

function SelectionDisplay(
  file_input,
  { floating, placeholder, ...updates },
  ...children
) {
  return create(
    "input.form-control",
    {
      attr_ariaLive: "polite",
      inert: true,
      ...updates,
    },
    function () {
      /* Add effect to update selection display */
      file_input.effects.add((data) => {
        if (file_input.multiple) {
          if (file_input.$.value) {
            if (file_input.$.value.length === 1) {
              this.value = file_input.$.value[0].name;
            } else {
              this.value = `${file_input.$.value.length} files selected`;
            }
          } else {
            this.value = floating ? null : placeholder;
          }
        } else {
          const value = floating ? null : placeholder;
          this.value = file_input.$.value ? file_input.$.value.name : value;
        }
      }, "value");
      /* Add effect to handle error styling */
      file_input.effects.add(
        (data) => {
          this.css["is-invalid"] = file_input.$.error && file_input.$.visited;
        },
        ["error", "visited"]
      );
    },
    ...children
  );
}

function SelectTrigger(file_input, updates = {}, ...children) {
  return create(
    "button.btn.btn-outline-secondary",
    updates,
    SelectIcon(),
    function (fragment) {
      /* Add handler to open file selector */
      this.on.click = (event) => {
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
          this.removeEventListener("blur", on_blur);
        }
        visited = true;
      };
      this.on.blur = on_blur;
    },
    ...children
  );
}
