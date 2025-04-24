/* 
20250401
src/rolloui/components/form/file_loader.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rolloui/components/form/file_loader.js
import { FileLoader } from "rolloui/components/form/file_loader";
const { FileLoader } = await import("rolloui/components/form/file_loader");
*/

import "@/bootstrap.scss";

import { Sheet, __, important, px } from "@/rollo/sheet/sheet.js";

import { Cancel } from "@/rollo/icons/cancel.js";
import { Help } from "@/rollo/icons/help.js";
import { Upload } from "@/rollo/icons/upload.js";

import { $, disabled, focus, selector, tag } from "@/rollo/tools/selector.js";
import { create_id } from "@/rollo/tools/id.js";
import { compose } from "@/rollo/tools/cls/compose.js";
import { hidden } from "@/rollo/tools/element/hidden.js";

import { component } from "@/rollo/component/component.js";
import { registry } from "@/rollo/component/tools/registry.js";

import { attribute } from "@/rollo/component/factories/attribute.js";
import { classes } from "@/rollo/component/factories/classes.js";
import { content } from "@/rollo/component/factories/content.js";
import { handlers } from "@/rollo/component/factories/handlers.js";
import { parent } from "@/rollo/component/factories/parent.js";
import { props } from "@/rollo/component/factories/props.js";
import { send } from "@/rollo/component/factories/send.js";

import { PopButton } from "@/rolloui/components/pop_button.js";
import { __elements__ } from "@/rolloui/components/factories/__elements__.js";
import { __states__ } from "@/rolloui/components/factories/__states__.js";

/* Load sheet that styles invalid feedback */
import "@/rolloui/components/form/assets/sheet.js";
import { styles } from "@/rolloui/components/form/tools/styles.js";

class cls extends compose(
  HTMLElement,
  {},
  __elements__,
  __states__,
  attribute,
  classes,
  content,
  handlers,
  parent,
  props,
  send
) {
  static name = "RolloFileLoader";

  constructor() {
    super();
  }

  __new__() {
    super.__new__?.();

    /* Init states */
    this.__states__.add("value");
    /* Build __elements__ */
    this.__elements__.update({
      clear: component.button(
        "btn.btn-dark.border.border-start-0._clear",
        { ariaLabel: "Clear file selection", disabled: true, type: "button" },
        Cancel({ size: 24 })
      ),
      display: component.input("form-control.w-100", {
        placeholder: " ",
        type: "text",
        /* Prevent user interaction and focus */
        inert: true,
      }),
      feedback: component.p("invalid-feedback.d-flex.ps-1.m-0", {
        /* Manage accessibility */
        id: create_id(),
        role: "status",
      }),
      floating: component.div("form-floating"),
      group: component.div("input-group"),
      help: PopButton(
        "btn-dark.border._help",
        { ariaLabel: "Help" },
        Help({ size: 20 })
      ),
      label: component.label({ for_: create_id() }),
      picker: component.button(
        "btn.btn-dark.px-3.border._picker",
        { ariaLabel: "Upload file", type: "button" },
        Upload()
      ),
    });

    /* Structure internal tree */
    const { clear, display, feedback, floating, group, label, picker } =
      this.__elements__;
    group.append(picker, floating.append(display, label), clear);

    /* Style component */
    this.classes.add(styles);

    /* Add internal tree */
    this.append(this.__elements__.group, feedback);
    /* Init file-input element */
    this.#create_input();
    /* Value state -> UI */
    this.__states__.value.effects.add(({ current }) => {
      if (current) {
        display.value = Array.isArray(current)
          ? `${current.length} files selected.`
          : current.name;
      } else {
        display.value = "";
      }
    });
    /* Value state -> clear-button disabled */
    this.__states__.value.effects.add(({ current }) => {
      clear.disabled = !current;
    });
    /* Value state -> validate */
    this.__states__.value.effects.add(() => this.validate());
    /* Clear click -> clear value state */
    clear.on.click = (event) => {
      this.attribute.visited = true;
      if (this.value) {
        /* Re-create file-input element to ensure that 'change' event fires */
        this.#create_input();
        this.__states__.value.update(null);
      }
    };
    /* Picker click -> visited (after one attempt) */
    picker.handlers.add("click", (event) => {}, {
      once: () => (this.attribute.visited = true),
    });
    /* Picker click -> open loader */
    picker.on.click = (event) => {
      /* Do NOT use closure to ref input (may have been replaced) */
      const { input } = this.__elements__;
      input.click();
      this.validate();
    };
    /* validity -> feedback, invalid styling and ARIA re invalid
    NOTE
    - Does (intentionally) not show positive validation styling. */
    this.on.validity = (event) => {
      /* Do NOT use closure to ref input (may have been replaced) */
      const { input } = this.__elements__;
      const invalid = event.detail;
      /* Clear any 'as_invalid' styling */
      display.classes.remove("is-invalid");
      /* Sync to component attr, feedback text and picker title */
      this.attribute.invalid =
        feedback.text =
        picker.attribute.title =
          invalid ? invalid : null;
      /* Sync to display style */
      if (invalid) {
        display.classes.if(this.attribute.visited, "is-invalid");
      } else {
        display.classes.remove("is-invalid");
      }
      /* Sync to ARIA
      NOTE
      - Setting ariaLive dynamically avoids premature SR announcement. */
      input.attribute.ariaInvalid = invalid ? "true" : null;
      feedback.attribute.ariaLive = invalid ? "polite" : null;
    };
  }

  /* Returns accept string. */
  get accept() {
    const { input } = this.__elements__;
    return input.attribute.accept || "";
  }
  /* Sets accept (file-type filter).
  NOTE
  - Can be provided as array of extensions with/without leading ".". 
  - false value removes file-type filter. */
  set accept(accept) {
    const { input } = this.__elements__;
    if (Array.isArray(accept)) {
      accept = accept
        .map((ext) => (ext.startsWith(".") ? ext : `.${ext}`))
        .join(",");
    } else if (!accept) {
      accept = null;
    }
    this.attribute.accept = input.attribute.accept = accept;
  }

  /* Returns disabled. */
  get disabled() {
    return this.attribute.disabled || false;
  }
  /* Sets disabled. */
  set disabled(disabled) {
    const { clear, picker } = this.__elements__;
    this.attribute.disabled = picker.disabled = disabled;
    if (this.value) {
      clear.disabled = disabled;
    }
  }

  /* Returns help. */
  get help() {
    return this.__elements__.help_content || null;
  }
  /* Sets help. */
  set help(content) {
    const { group, help } = this.__elements__;
    this.attribute.help = content;
    /* Store content in __elements__ for retrieval from getter */
    this.__elements__.help_content = content;
    if (content) {
      help.content = content;
      group.append(group.contains(help) ? null : help);
    } else {
      help.remove();
    }
  }

  /* Returns multiple. */
  get multiple() {
    return this.attribute.multiple;
  }
  /* Sets multiple. */
  set multiple(multiple) {
    const { input, picker } = this.__elements__;
    this.attribute.multiple = input.multiple = multiple;
    picker.ariaLabel = multiple ? "Upload files" : "Upload file";
  }

  /* Returns name. */
  get name() {
    return this.attribute.name;
  }
  /* Sets name. */
  set name(name) {
    const { input } = this.__elements__;
    this.attribute.name = input.name = name;
  }

  /* Returns 'required'. */
  get required() {
    return this.attribute.required || false;
  }
  /* Sets 'required'. */
  set required(required) {
    const { input } = this.__elements__;
    this.attribute.required = input.required = required;
    this.validate();
  }

  /* Returns label text. */
  get text() {
    const { label } = this.__elements__;
    return label.text || null;
  }
  /* Sets label text. */
  set text(text) {
    const { label } = this.__elements__;
    label.text = text;
  }

  /* Returns value state. */
  get value() {
    return this.__states__.value.current;
  }

  /* Styles as invalid and shows message as hard feedback. Chainable.
  NOTE
  - Does NOT render the input element invalid. 
  - Useful for momentarily showing server-side validation. */
  as_invalid(message) {
    const { display, feedback } = this.__elements__;
    feedback.text = message || null;
    display.classes.if(message, "is-invalid");
    return this;
  }

  /* Performs validation and fires custom validity event. Returns valid flag. */
  validate() {
    const { input } = this.__elements__;
    const invalid = this.value === null && this.required ? "Required" : false;
    this.send("validity", { detail: invalid });
    return input.checkValidity();
  }

  #create_input() {
    const { feedback, label, picker } = this.__elements__;
    let input = this.__elements__.input;
    /* Remove any existing input from the DOM */
    if (input) {
      input.remove();
    }
    /* Create and add a fresh input component */
    input = this.__elements__.input = component.input(
      {
        id: label.for_,
        parent: picker,
        type: "file",
        /* Manage accessibility */
        ariaDescribedBy: feedback.id,
        ...hidden,
      },
      /* Input change -> value state */
      (self) => {
        self.on.change = (event) => {
          const state = this.__states__.value;
          if (!self.files.length) {
            state.update(null);
          } else if (self.files.length === 1) {
            state.update(self.files[0]);
          } else {
            state.update(Array.from(self.files));
          }
        };
      },
      /* Pass on 'invalid' events to component */
      (self) => {
        self.on.invalid = (event) => this.send("invalid", { detail: event });
      },
      /* Since input is placed inside a button, prevent click from 
      re-triggering button click */
      (self) => {
        self.on.click = (event) => event.stopPropagation();
      }
    );
    if (this.name) {
      input.name = this.name;
    }
  }
}

registry.add(cls);

/* Implement component-tag-specific light-DOM styles */
(() => {
  const sheet = Sheet(document);
  const TAG = cls.__tag__;
  const rules = {
    /* Style picker background */
    [selector(TAG).child($._picker)]: { backgroundColor: __.bs_tertiary_bg },
    /* Hide clear button, when disabled */
    [selector(TAG).child(disabled($._clear))]: { display: null },
    /* Make room for invalid style */
    [selector(TAG).attr({ invalid: true, visited: true }).child($._picker)]: {
      marginRight: px(1),
    },
    [selector(TAG)
      .has(selector(tag.input).$({ is_invalid: true }))
      .child($._picker)]: {
      marginRight: px(1),
    },
    [selector(TAG).attr({ invalid: true, visited: true }).child($._help)]: {
      marginLeft: important(px(1)),
    },
    [selector(TAG)
      .has(selector(tag.input).$({ is_invalid: true }))
      .child($._help)]: {
      marginLeft: important(px(1)),
    },
    /* Remove box shadow to clearly show invalid styling */
    [selector(TAG)
      .attr({ invalid: true, visited: true })
      .child(focus($._picker))]: {
      boxShadow: null,
    },
    [selector(TAG)
      .has(selector(tag.input).$({ is_invalid: true }))
      .child(focus($._picker))]: {
      boxShadow: null,
    },
    /* Ensure correct end radius, when clear button not displayed and no help */
    [selector(TAG)
      .attr({ help: false })
      .has(disabled($._clear))
      .child(tag.input)]: {
      borderTopRightRadius: important(__.bs_border_radius),
      borderBottomRightRadius: important(__.bs_border_radius),
    },
  };
  /* NOTE Exploits auto-string conversion of object keys (keys in 'rules' are 
  not necessarily strings, but such non-string keys have a 'toString' method) */
  Object.entries(rules).forEach(([k, v]) => sheet.add({ [k]: v }));
})();

/* Returns form-control component for file loading. */
export const FileLoader = (...args) => {
  const self = component.rollo_file_loader(...args);
  return self;
};
