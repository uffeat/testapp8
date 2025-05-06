/*
modules/public_meta
*/

import { modules } from "@/rollovite/modules.js";

const success = () => console.info("Success!");

export const test_has = (unit_test) => {
  const actual = modules.public.has("/test/foo/foo.css");
  const expected = true;
  if (actual !== expected) {
    console.error(`'modules.src.has()' or 'modules' config failed!`);
  } else if (unit_test) {
    success();
  }
};

export const test_has_not = (unit_test) => {
  const actual = modules.public.has("/test/foo/no.css");
  const expected = false;
  if (actual !== expected) {
    console.error(`'modules.src.has()' or 'modules' config failed!`);
  } else if (unit_test) {
    success();
  }
};

export const test_size = (unit_test) => {
  if (unit_test) {
    console.log("Number of js load functions:", modules.public.size());
  }
};
