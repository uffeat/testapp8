import { component } from "@/rollo/component/component.js";


import { brython } from "@/libs/brython/brython";


/* Test */
brython.run("print('Hello from Brython')");
//
//

/* NOTE Do NOT await import! */
if (import.meta.env.DEV) {
  import("@/main/development/main.js");
} else {
  import("@/main/production/main.js");
}
