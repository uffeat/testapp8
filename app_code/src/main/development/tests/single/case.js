/*
http://localhost:5173/@/test/single/case.js
*/

import { camel_to_kebab } from "@/rollo/tools/text/case.js";
//const { camel_to_kebab } = await modules.get("@/rollo/tools/text/case.js")


console.log('kebab:', camel_to_kebab('uffeArlo'))

//console.log('raw:', await modules.get("@/rollo/tools/text/case.js", {raw: true}))