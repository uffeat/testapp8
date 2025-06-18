/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

console.info("Vite environment:", import.meta.env.MODE);

document.querySelector("html").dataset.bsTheme = "dark";


import { components } from "@/rollocomponent/tools/components.js";

const Foo = await use("@/components/foo.x.html");
const foo = Foo({ parent: document.body });

const FooP = await use("/components/foo.x.html");
const foop = FooP({ parent: document.body });



//const Bar = await components.import("bar");
//const bar = Bar({ parent: document.body });


//const Stuff = await components.import("stuff/");
//const stuff = Stuff({ parent: document.body });

