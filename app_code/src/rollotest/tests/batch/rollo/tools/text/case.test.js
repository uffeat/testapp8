/*
batch/rollo/tools/text/case
*/

import { camel_to_kebab } from "@/rollo/tools/text/case.js";


/* In-module error message to retain traceback */
const error = (actual, expected) => {
  console.error("Expected:", expected, "\nActual:", actual);
};

export const test_camel_to_kebab = (unit_test) => {
  const expected = 'uffe-arlo'
  const actual = camel_to_kebab('uffeArlo')
  if (actual !== expected) {
    error(actual, expected)
  }

  else {
    if (unit_test) {
      console.log('Success!')
    }
   
  }


}



