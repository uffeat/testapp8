/*
import { bootstrap } from "@/rollolibs/bootstrap/sheets/bootstrap.js"
const { bootstrap } = await use("@/rollolibs/bootstrap/sheets/bootstrap.js")
20250617
v.1.0
*/

import { Sheet } from "@/rollosheet/tools/sheet.js";
import text from "@/rollolibs/bootstrap/_src/bootstrap.css?raw";

//export { text };
export const bootstrap = new Sheet(text, { name: "bootstrap" });
