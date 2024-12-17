import "rolloui/form/form.css";
import { create } from "rollo/component";
import { mirror } from "@/rolloui/utils/mirror";
import { mixin } from "@/rolloui/utils/mixin";
import { Cancel as CancelIcon } from "rolloui/icons/Cancel";
import { Upload as SelectIcon } from "rolloui/icons/Upload";
import { Floating } from "rolloui/form/Floating";
import { InvalidFeedback } from "@/rolloui/form/_InvalidFeedback";
import { Label } from "@/rolloui/form/_Label";

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
  const error_feedback = InvalidFeedback({ form_control });
  const select_trigger = create(
    "button.btn.btn-outline-secondary",
    {},
    SelectIcon()
  );
  const clear_trigger = create(
    "button.btn.btn-outline-secondary",
    {},
    CancelIcon({ size: 24 })
  );
  const selection_display = create("input.form-control", {
    attribute_ariaLive: "polite",

    inert: true,
  });
  const input_group = create(
    "div.input-group",
    {},
    select_trigger,
    floating ? Floating({ label }, selection_display) : selection_display,
    clear_trigger
  );
  /* Handler to open file selector */
  select_trigger.onclick = (event) => {
    event.preventDefault();
    form_control.click();
  };
  /* Protect state */
  const set_error = form_control.reactive.protected.add("error");
  const set_value = form_control.reactive.protected.add("value");
  const set_visited = form_control.reactive.protected.add("visited");

  /* Manage state */

  (() => {
    /* Set visited state (one-time handler) */
    let visited;
    /* Blur happens, when file selector opens; therefore flag needed to determine,
    if file selector has been opened previously . */
    select_trigger.onblur = (event) => {
      if (visited) {
        set_visited(true);
        select_trigger.onblur = null;
      }
      visited = true;
    };
  })();

  form_control.effects.add((data) => {
    /* Value state -> selection display */
    if (form_control.multiple) {
      if (form_control.$.value) {
        if (form_control.$.value.length === 1) {
          selection_display.value = form_control.$.value[0].name;
        } else {
          selection_display.value = `${form_control.$.value.length} files selected`;
        }
      } else {
        selection_display.value = floating ? null : placeholder;
      }
    } else {
      const value = floating ? null : placeholder;
      selection_display.value = form_control.$.value
        ? form_control.$.value.name
        : value;
    }
  }, "value");

  form_control.effects.add(
    (data) => {
      /* Error & visited state -> feedback style */
      selection_display.css_class.isInvalid =
        form_control.$.error && form_control.$.visited;
    },
    ["error", "visited"]
  );

  form_control.on.change = (event) => {
    /* Selected file(s) -> value state */
    if (form_control.multiple) {
      set_value(form_control.files.length > 0 ? [...form_control.files] : null);
    } else {
      set_value(form_control.files.length > 0 ? form_control.files[0] : null);
    }
  };

  form_control.effects.add((data) => {
    /* Value state -> error state */
    if (form_control.required) {
      set_error(!form_control.$.value ? "Required" : null);
    }
  }, "value");

  clear_trigger.onclick = (event) => {
    /* Reset value state */
    event.preventDefault();
    set_value(null);
  };

  /* Build tree */
  const self = create(
    "section",
    {
      attribute_constructorName: "FileInput",
      ...updates,
    },
    (() => {
      if (label && !floating) {
        const self = Label({ form_control, text: label }, '.btn.p-0.mb-1');
        /* Set visited state (one-time handler) */
        let visited;
        /* Blur happens, when file selector opens; therefore flag needed to determine,
        if file selector has been opened previously . */
        const on_blur = (event) => {
          if (visited) {
            set_visited(true);
            self.removeEventListener("blur", on_blur);
          }
          visited = true;
        };
        self.on.blur = on_blur;
        return self;
      }
    })(),
    input_group,
    error_feedback,
    form_control,
    ...hooks
  );
  /* Create external API */
  mixin(
    form_control,
    class {
      get value() {
        return form_control.$.value;
      }
    }
  );
  mirror(self, form_control, "name");

  return self;
}
