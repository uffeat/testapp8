import "@/main.css";
import { Use } from "@/rollouse/use.js";
import "@/rollolibs/bootstrap/bootstrap.js";








/* Dark mode */
document.querySelector("html").dataset.bsTheme = "dark";

/* app */
const { app } = await Use.module("/rolloapp/");
Object.defineProperty(window, "app", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: app,
});
await app.shadow.sheets.import("/rolloapp/assets/shadow");
await Use.module("/rolloapp/assets/main.css");

/* Env */
const { meta } = await Use.module("/meta.js");
console.info("Environment:", meta.env.name);
