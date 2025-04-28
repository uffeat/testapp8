/*
batch/rollo/component/attribute
*/

import { component } from "@/rollo/component/component.js";
import { match } from "@/rollo/tools/object/match.js";

/* In-module error message to retain traceback */
const error = (actual, expected) => {
  console.error("Expected:", expected, "\nActual:", actual);
};

/* Does event capture change? */
export const event_capture = (unit_test) => {
  const expected = { name: "foo", current: "FOO", previous: null }; ////

  const button = component.button();
  button.on.attribute = (event) => {
    const actual = event.detail;
    if (!match(actual, expected)) {
      error(actual, expected)
    } else {
      if (unit_test) {
        console.log('Success!')
      }
    }
  };
  button.attribute.foo = "FOO";
};

/* Does event only fire, when change? */
export const event_fire = (unit_test) => {
  let actual = 0;
  const expected = 2;

  const button = component.button();
  button.on.attribute = (event) => {
    actual++;
    if (button.attribute.foo === "STOP") {
      if (actual !== expected) {
        error(actual, expected)
      } else {
        if (unit_test) {
          console.log('Success!')
        }
      }
    }
  };
  button.attribute.foo = "FOO";
  button.attribute.foo = "FOO";
  button.attribute.foo = "STOP";
};
