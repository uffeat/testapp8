/*
index.js
*/



import "@/main.css";
import "@/rollouse/use.js";

/* Bootstrap */
await use("@/rollolibs/bootstrap/")
document.querySelector("html").dataset.bsTheme = "dark";
/* app */
await use("@/rolloapp/");
/* Env */
const { meta } = await use("@/meta.js");
console.info("Environment:", meta.env.name);


/* tests */
use("@/rollotest/")



/* main */
await use("@/main.js")



