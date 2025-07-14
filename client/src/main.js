import "@/rollotest/__init__.js";

document.querySelector("html").dataset.bsTheme = "dark";

console.info("Environment:", meta.env.name);



import { main } from "@/rolloanvil/main.js";




const echo = await use("echo.py");
echo({ echo: "echo!echo" }).then((result) => console.log(result));

const foo = await use("foo.py");
foo().then((result) => console.log(result));

