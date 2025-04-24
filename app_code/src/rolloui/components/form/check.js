/* 
20250325
src/rolloui/components/form/check.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rolloui/components/form/check.js
import { Check } from "rolloui/components/form/check";
const { Check } = await import("rolloui/components/form/check");
*/

/* TODO
- disable feature */

import { Sheet, rem } from "rollo/sheet/sheet.js";
import { compose } from "rollo/tools/cls/compose.js";
import { component } from "rollo/component/component.js";
import { registry } from "rollo/component/tools/registry.js";

import { attribute } from "rollo/component/factories/attribute.js";
import { classes } from "rollo/component/factories/classes.js";
import { content } from "rollo/component/factories/content.js";
import { handlers } from "rollo/component/factories/handlers.js";
import { parent } from "rollo/component/factories/parent.js";
import { props } from "rollo/component/factories/props.js";
import { send } from "rollo/component/factories/send.js";

import { __elements__ } from "@/rolloui/components/factories/__elements__.js";
import { as_invalid } from "rolloui/components/form/factories/as_invalid.js";
import { name } from "rolloui/components/form/factories/name.js";
import { required } from "rolloui/components/form/factories/required.js";
import { states } from "rolloui/components/form/factories/states.js";
import { text } from "rolloui/components/form/factories/text.js";
import { validate } from "rolloui/components/form/factories/validate.js";
import { visited } from "rolloui/components/form/factories/visited.js";

import "rolloui/components/form/assets/sheet";
import { styles } from "rolloui/components/form/tools/styles";

/* TODO
- Enter/Esc toggles */

class cls extends compose(
  HTMLElement,
  {},
  __elements__,
  as_invalid,
  attribute,
  classes,
  content,
  handlers,
  name,
  parent,
  props,
  required,
  send,
  states,
  text,
  validate,
  visited
) {
  static name = "RolloCheck";
  static sheet = Sheet(document);

  constructor() {
    super();
    /* Build __dict__ with internal tree */
    Object.assign(this.__elements__, {
      form_switch: component.div("form-check.form-switch"),
      input: component.input("form-check-input", {
        type: "checkbox",
      }),
      label: component.label("form-check-label"),
      feedback: component.p("invalid-feedback.d-flex.m-0"),
    });
    this.__elements__.form_switch.append(this.__elements__.input, this.__elements__.label);
  }

  __new__() {
    super.__new__ && super.__new__();
    /* Style component */
    this.classes.add(styles);
    /* Remove standard gap, which is a little too large 
    (gap set in component sheet) */
    this.classes.remove('row-gap-1');
    /* Add internal tree */
    this.append(this.__elements__.form_switch, this.__elements__.feedback);
    const input = this.__elements__.input;
    /* UI -> value state */
    input.on.change = (event) => (this.value = input.checked ? true : null);
    /* Value state -> UI */
    this.states.value.effects.add(({ current }) => (input.checked = current));
    /* Value state -> attribute */
    this.states.value.effects.add(
      ({ current }) => (this.attribute.value = current)
    );
    /* Value state change -> validate */
    this.states.value.effects.add(() => this.validate && this.validate());
    /* Pass on 'invalid' events to component */
    input.on.invalid = (event) => this.send("invalid", { detail: event });
    /*  Input blur -> visited */
    input.on.blur = (event) => (this.attribute.visited = true);
  }

  __init__() {
    super.__init__ && super.__init__();
    const input = this.__elements__.input;
    /* Input blur -> validate */
    input.on.blur = (event) => this.validate();
    /* NOTE Register in __init__ to make sure that blur handler that sets 
    'visited' fires first */
  }

  /* Returns value state. */
  get value() {
    return this.states.value.current;
  }
  /* Sets value state. */
  set value(value) {
    this.states.value.update(value);
  }
}

registry.add(cls);

cls.sheet.add({
  [cls.__tag__]: {
    rowGap: rem(0.125)
  },
});

/* Returns form control component for Boolean input. */
export const Check = (...args) => {
  const self = component.rollo_check(...args);
  return self;
};
