/*
import("@/main/production/main.js");
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";
import "@/main/development/rollomd/__init__.js";
import "@/main/development/rollossg/__init__.js";

//import { Papa } from "@/rollopapaparse/papaparse.js";
//console.log("papa:", Papa);

await (async () => {
  const { foo } = await use("@/test/foo/foo.js");
  console.log("foo:", foo);

  const { Papa } = await use("@/rollolibs/papa.js");
  console.log("Papa:", Papa);

  const csv = Papa.parse(`Column 1,Column 2,Column 3,Column 4
1-1,1-2,1-3,1-4
2-1,2-2,2-3,2-4
3-1,3-2,3-3,3-4
4,5,6,7`);
console.log("csv:", csv);

  const { parse } = await use("@/rollolibs/marked.js");
  //console.log("parse:", parse);
})();

console.info("Vite environment:", import.meta.env.MODE);
