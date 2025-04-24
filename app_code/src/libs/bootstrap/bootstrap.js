// import { bootstrap } from "@/libs/bootstrap/bootstrap.js";

import text from "@/libs/bootstrap/bootstrap.css?raw";
export const bootstrap = new CSSStyleSheet();
bootstrap.replaceSync(text);
