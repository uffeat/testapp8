import "@/main.css";
import "@/rollouse/use.js";
//import "@/rollolibs/bootstrap/bootstrap.js";
await use("@/rollolibs/bootstrap/bootstrap.js")

/* Dark mode */
document.querySelector("html").dataset.bsTheme = "dark";
/* app */
await use("@/rolloapp/");
/* Env */
const { meta } = await use("@/meta.js");
console.info("Environment:", meta.env.name);
