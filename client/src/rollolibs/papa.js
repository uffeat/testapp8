/*
"@/rollolibs/papa.js"
20250523
v.1.1
*/

import { factory } from "@/rollolibs/tools/factory.js";

if (import.meta.env.DEV) {
  console.info("Loading PapaParse...");
}

/* Create and add iframe with scripts injected */
const iframe = await factory("rollolibs/papa/main.js");

/* Harvest */
export const Papa = iframe.contentWindow.Papa;

/* Clean up */
iframe.remove();
