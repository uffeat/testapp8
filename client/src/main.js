import "@/main.css";
import "@/rollolibs/bootstrap/bootstrap.css"
import {meta} from "@/meta.js"
import "@/rolloapp/rolloapp.js";


document.querySelector("html").dataset.bsTheme = "dark";
console.info("Environment:", meta.env.name);

/* tests */
use("@/rollotest/");

const { component } = await use("@/rollocomponent/");

component.h1({ parent: app }, "On a roll, Hugo!");



 

/*
const echo = await use("echo.py");
echo({ echo: "echo!echo" }).then((result) => console.log(result));
*/
