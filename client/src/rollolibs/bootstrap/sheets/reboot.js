/*
import { reboot } from "@/rollolibs/bootstrap/sheets/reboot.js"
const { reboot } = await use("@/rollolibs/bootstrap/sheets/reboot.js")
20250616
v.1.0
*/

import text from "../src/reboot.css?raw";
const { Sheet } = await use("@/rollosheet/");



export const reboot = new Sheet(text, {name: 'reboot'})


