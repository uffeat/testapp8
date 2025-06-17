/*
import { bootstrap } from "@/rollolibs/bootstrap/bootstrap.js"
const { bootstrap } = await use("@/rollolibs/bootstrap/bootstrap.js")
20250617
v.1.0
*/

import { Sheet } from "@/rollosheet/tools/sheet.js";
import text from "@/libs/bootstrap/bootstrap.css?raw";

export const bootstrap = new Sheet(text)


