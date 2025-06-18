/*
"@/main/preview/main.js"
import("@/main/preview/main.js");
20250520
*/

import "@/rollotest/__init__.js";


console.info("Vercel environment:", import.meta.env.VERCEL_ENV);

document.querySelector("html").dataset.bsTheme = "dark";


const Foo = await use("@/components/foo.rollo");
const foo = Foo({ parent: document.body });

const FooP = await use("/components/foo.rollo");
const foop = FooP({ parent: document.body });