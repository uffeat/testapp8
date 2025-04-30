/*
brython/hello
*/

import { brython } from "@/libs/brython/brython";

export const test = (unit_test) => {
  if (!unit_test) return
  brython.run("print('Hello from Brython')");
}



