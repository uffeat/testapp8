/*
modules/public_css
*/

import { component } from "@/rollo/component/component.js";

export const test = async (unit_test) => {
  await modules.get("/test/foo/foo.css");
  if (unit_test) {
    component.h1("foo", { parent: document.body }, "FOO");
  }
};
