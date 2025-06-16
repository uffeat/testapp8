/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

console.info("Vite environment:", import.meta.env.MODE);


import { components } from "@/rollocomponent/tools/components.js";

const Foo = await components.import("foo.html");

const foo = Foo({ parent: document.body });
