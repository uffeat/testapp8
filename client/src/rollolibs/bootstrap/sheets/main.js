/*
import { main } from "@/rollolibs/bootstrap/sheets/main.js"
const { main } = await use("@/rollolibs/bootstrap/sheets/main.js")
20250617
v.1.0
*/

import { Sheet } from "@/rollosheet/tools/sheet.js";
import text from "@/rollolibs/bootstrap/_src/bootstrap.css?raw";

export const main = new Sheet(text, { name: "bootstrap" });
