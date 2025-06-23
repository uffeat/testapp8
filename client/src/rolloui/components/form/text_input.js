/* 
20250316
src/rolloui/components/form/text_input.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rolloui/components/form/text_input.js
import { TextInput } from "rolloui/components/form/text_input";
const { TextInput } = await import("rolloui/components/form/text_input");

Composite non-child-accepting component.
Componetization of Bootstrap's floating label form control with validation and group.
*/

import { create_id } from "@/rollo/tools/id.js";

import { compose } from "@/rollo/tools/cls/compose.js";
import { component } from "@/rollo/component/component.js";
import { registry } from "@/rollo/component/tools/registry.js";

import { attribute } from "@/rollo/component/factories/attribute.js";
import { classes } from "@/rollo/component/factories/classes.js";
import { content } from "@/rollo/component/factories/content.js";
import { handlers } from "@/rollo/component/factories/handlers.js";
import { parent } from "@/rollo/component/factories/parent.js";
import { props } from "@/rollo/component/factories/props.js";
import { send } from "@/rollo/component/factories/send.js";

import { Help } from "public/icons/help";
import { PopButton } from "@/rolloui/components/pop_button.js";

import { __elements__ } from "@/rolloui/components/factories/__elements__.js";
import { __states__ } from "@/rolloui/components/factories/__states__.js";

import { validators } from "@/rolloui/components/form/factories/validators.js";

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
  send,
  validators
) {
  static name = "RolloTextInput";

  __new__() {
    super.__new__?.();
    /* Init states */
    this.__states__.add("value");
    /* Build __elements__ */
    this.__elements__.update({
      feedback: component.p("invalid-feedback.d-flex.ps-1.m-0"),
      floating: component.div("form-floating"),
      group: component.div("input-group"),
      help: PopButton(
        "btn-dark.border._help",
        { ariaLabel: "Help" },
        Help({ size: 20 })
      ),
      input: component.input("form-control.w-100", {
        placeholder: " ",
        /* title: '' -> removes browser's default validation "tooltip". */
        title: "",
        type: "text",
      }),
      label: component.label(),
      prefix: component.span("input-group-text"),
    });

    /* Structure and prepare internal tree */
    const { feedback, floating, group, input, label } = this.__elements__;
    input.id = label.for_ = create_id();
    group.append(floating.append(input, label));

    /* Style component */
    this.classes.add(styles);
    /* Add internal tree */
    this.append(group, feedback);
    /* UI -> value state */
    input.on.input = (event) =>
      (this.value = input.value.trim() === "" ? null : input.value);
    /* Value state -> UI */
    this.__states__.value.effects.add(({ current }) => (input.value = current));
    /* Value state change -> validate */
    this.__states__.value.effects.add(() => this.validate());
    /* Pass on 'invalid' events to component */
    input.on.invalid = (event) => this.send("invalid", { detail: event });
    /* Input blur -> visited attr */
    input.on.blur = (event) => (this.attribute.visited = true);
    /* validity -> feedback, attr, title and style.
    NOTE
    - Does (intentionally) not show positive validation styling. */
    this.on.validity = (event) => {
      /* Clear any 'as_invalid' styling */
      input.classes.remove("is-invalid");

      const invalid = event.detail;
      this.attribute.invalid = invalid;
      input.attribute.title = invalid;
      feedback.text = invalid ? invalid : null;
      if (invalid) {
        this.classes.if(this.attribute.visited, "was-validated");
      } else {
        this.classes.remove("was-validated");
      }
    };
  }

  __init__() {
    super.__init__?.();
    /* Provide default type. */
    if (!this.type) {
      this.type = "text";
    }
    const { input } = this.__elements__;
    /* Input blur -> validate */
    input.on.blur = (event) => this.validate();
    /* NOTE Register in __init__ to make sure that blur handler that sets 
    'visited' attr fires first */
  }

  /* Returns disabled. */
  get disabled() {
    return this.attribute.disabled || false;
  }
  /* Sets disabled. */
  set disabled(disabled) {
    const { input } = this.__elements__;
    this.attribute.disabled = input.attribute.disabled = disabled;
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

  /* Returns name. */
  get name() {
    return this.attribute.name;
  }
  /* Sets name. */
  set name(name) {
    const { input } = this.__elements__;
    this.attribute.name = input.name = name;
  }

  /* Returns prefix (only-child of prefix container). */
  get prefix() {
    return this.__elements__.prefix.firstChild;
  }
  /* Sets prefix. */
  set prefix(node) {
    const { group, prefix } = this.__elements__;
    if (node) {
      prefix.clear().append(node);
      group.elements.insert.afterbegin(group.contains(prefix) ? null : prefix);
    } else {
      prefix.remove();
    }
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

  /* Returns type. */
  get type() {
    return this.attribute.type;
  }
  /* Sets type. */
  set type(type) {
    const { input } = this.__elements__;
    this.attribute.type = input.type = type;
  }

  /* Returns value state. */
  get value() {
    return this.__states__.value.current;
  }
  /* Sets value state. */
  set value(value) {
    this.__states__.value.update(value);
  }

  /* Styles as invalid and shows message as hard feedback. Chainable.
  NOTE
  - Does NOT render the input element invalid. 
  - Gives way to any built-in and custom event-driven validators. 
  - Useful for momentarily showing server-side validation. */
  as_invalid(message) {
    const { feedback, input } = this.__elements__;
    feedback.text = message || null;
    input.classes.if(message, "is-invalid");
    return this;
  }

  /* Performs validation. Fires custom validity event. Returns valid flag.
    NOTE
    - Does not rely on native validation for actual validation.
    - Uses native validation mechanisms, so that an invalid value does fire
      invalid event and obeys CSS validation-related pseudo-selectors.
    - Does not use multiple native validity states, only valueMissing and 
      customError. In this way, the input element is either valid or invalid
      by required or custom error. Takes out the guesswork re, which validation 
      message to report. */
  validate() {
    const { input } = this.__elements__;
    /* Determine invalid */
    let invalid;
    if (this.value === null) {
      if (this.required) {
        /* value is null -> 'required' is the only relevant validator. */
        invalid = "Required";
        //input.setCustomValidity("");////
      }
    } else if (this.validators) {
      /* validators only run, if value is non-null */
      invalid = this.validators.validate();
      input.setCustomValidity(invalid);
    } else {
      invalid = false;
      //input.setCustomValidity("");////
    }
    ////console.log("invalid:", invalid); ////
    this.send("validity", { detail: invalid });
    return input.checkValidity(); ////
  }
}

registry.add(cls);

/* Returns form control component for short text input. */
export const TextInput = (...args) => {
  const self = component.rollo_text_input(...args);
  return self;
};
