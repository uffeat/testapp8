/* Global styles */
import "@/bootstrap.scss";
import "@/main.css";

import { vercel } from "@/rollovercel/vercel.js";

import { component } from "@/rollo/component/component.js";
import { Check } from "@/rolloui/components/form/check.js";

document.querySelector("html").dataset.bsTheme = "dark";

document.body.append(Check());

const { foo } = await modules.import.src.test.foo.foo.js()
console.log('foo:', foo)

const raw_foo = await modules.import.src.test.foo.foo.js({raw: true})
console.log('raw_foo:', raw_foo)

console.log('foo:',(await modules.get("/test/foo/foo.js")).foo)



/* Enable triggering of tests.
NOTE
- These tests should be confined to features not available in Vite development, 
  e.g., serverless functions. All other tests should be relegated to 
  main/development/tests  */
if (!vercel.environment.PRODUCTION) {
  
}
