/*
brython/hello
*/

import { brython } from "@/libs/brython/brython";

export const test = () => {
  brython.run("print('Hello from Brython')");
}



