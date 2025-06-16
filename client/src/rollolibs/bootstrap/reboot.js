/*
import { reboot } from "@/rollolibs/bootstrap/reboot.js"
const { reboot } = await use("@/rollolibs/bootstrap/reboot.js")
20250616
v.1.0
*/

import { Sheet } from "@/rollosheet/tools/sheet.js";
import text from "@/libs/bootstrap/reboot.css?raw";

export const reboot = new Sheet(text)


