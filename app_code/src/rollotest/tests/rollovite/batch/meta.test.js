/*
rollovite/batch/meta
*/

import { modules } from "@/rollovite/modules.js";
/* Add loader to handle files in /src/test */
import "@/rollotest/tests/rollovite/loaders/test.js";

const success = () => console.info("Success!");



export const test_has = (unit_test) => {
  const actual = modules.src.has("@/test/foo/foo.css");
  const expected = true;
  if (actual !== expected) {
    console.error(`'modules.src.has()' or 'modules' config failed!`);
  } else if (unit_test) {
    success();
  }
};

export const test_has_not = (unit_test) => {
  const actual = modules.src.has("@/test/foo/no.css");
  const expected = false;
  if (actual !== expected) {
    console.error(`'modules.src.has()' or 'modules' config failed!`);
  } else if (unit_test) {
    success();
  }
};

export const test_src_size = (unit_test) => {
  if (unit_test) {
    console.log("Number of js load functions:", modules.src.size());
  }
};

export const test_processors_size = (unit_test) => {
  if (unit_test) {
    const actual = modules.processors.size();
    const expected = 0;
    if (actual === expected) {
      success();
    } else {
      console.error("Expected:", expected, "\nActual:", actual);
    }
  }
};
