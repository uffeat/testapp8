// import { reboot } from "@/libs/bootstrap/reboot";

import text from "@/libs/bootstrap/reboot.css?raw";
export const reboot = new CSSStyleSheet();
reboot.replaceSync(text);
