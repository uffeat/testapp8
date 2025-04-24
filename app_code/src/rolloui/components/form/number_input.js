/* 
20250316
src/rolloui/components/form/number_input.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rolloui/components/form/number_input.js
import { NumberInput } from "rolloui/components/form/number_input";
const { NumberInput } = await import("rolloui/components/form/number_input");
*/

import { is_number } from "rollo/tools/is/is_number.js";

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
import { prefix } from "rolloui/components/form/factories/prefix.js";
import { required } from "rolloui/components/form/factories/required.js";
import { states } from "rolloui/components/form/factories/states.js";
import { suffix } from "rolloui/components/form/factories/suffix.js";
import { text } from "rolloui/components/form/factories/text.js";
import { validate } from "rolloui/components/form/factories/validate.js";
import { validators } from "@/rolloui/components/form/factories/validators.js";
import { visited } from "rolloui/components/form/factories/visited.js";

import { Tree } from "rolloui/components/form/tools/tree.js";
import "rolloui/components/form/assets/sheet.js";
import { styles } from "rolloui/components/form/tools/styles.js";


/* TODO
- disable feature */

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
  prefix,
  props,
  required,
  send,
  states,
  suffix,
  text,
  validate,
  validators,
  visited
) {
  static name = "RolloNumberInput";

  constructor() {
    super();
    /* Build __elements__ with internal tree */
    Object.assign(this.__elements__, Tree());
    /* Structure internal tree */
    this.__elements__.floating.append(this.__elements__.input, this.__elements__.label);
    this.__elements__.group.append(this.__elements__.floating);
  }

  __new__() {
    super.__new__ && super.__new__();
    /* Style component */
    this.classes.add(styles);
    /* Add internal tree */
    this.append(this.__elements__.group, this.__elements__.feedback);

    const input = this.__elements__.input;

    /* Handle type */
    this.attribute.type = "numeric";
    input.inputMode = "numeric";
    /* UI -> value state */
    input.on.input = (event) => {
      if (!is_valid(input.value)) {
        input.value = input.value.slice(0, -1);
      }
      if (["", "-", ".", ","].includes(input.value)) {
        this.value = null;
      } else {
        this.value = Number(input.value.replace(",", "."));
      }
    };
    /* Value state -> UI */
    this.states.value.effects.add(({ current }) => (input.value = current));
    /* Value state -> attribute */
    this.states.value.effects.add(
      ({ current }) => (this.attribute.value = current)
    );
    /* Value state change -> validate */
    this.states.value.effects.add(() => this.validate && this.validate());
    /* Pass on 'invalid' events to component */
    input.on.invalid = (event) => this.send("invalid", { detail: event });
    /* Input blur -> visited */
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

  /* Returns type. */
  get type() {
    return this.attribute.type;
  }

  /* Returns value state. */
  get value() {
    return this.states.value.current;
  }
  /* Sets value state. */
  set value(value) {
    if (!is_number(value) && value !== null) {
      throw Error(`Invalid value: ${value}`);
    }
    this.states.value.update(value);
  }
}

registry.add(cls);

/* Implement component class-specific light-DOM styles */


/* Returns form control component for numeric inputs.
NOTE
- Based on type-text input, but mimics the native type-number input.
- Allows for live validation, which is difficult to achieve with the native type-number input. */
export const NumberInput = (...args) => {
  const self = component.rollo_number_input(...args);
  return self;
};

/* Checks if value contains only digits - allowing for a single decimal mark 
('.' or ',') and a leading '-'. Also allows null. */
function is_valid(value) {
  if (value === null || value === "") {
    return true;
  }
  const pattern = /^-?\d*[.,]?\d*$/;
  return pattern.test(value);
}
