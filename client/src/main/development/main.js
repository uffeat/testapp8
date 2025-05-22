/*
import("@/main/production/main.js");
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";
import "@/main/development/rollomd/__init__.js";
import "@/main/development/rollossg/__init__.js";



await (async () => {

  console.log("Parsed csv:", await use("@/test/foo/foo.csv"));
  
  
})();

console.info("Vite environment:", import.meta.env.MODE);
