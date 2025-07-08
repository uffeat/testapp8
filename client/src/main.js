import "@/rollotest/__init__.js";

document.querySelector("html").dataset.bsTheme = "dark";

console.info("Environment:", meta.env.name);

import { server } from "@/rolloanvil/server.js";


server
  .echo([1,2,3])
  .then((response) => console.log("server response:", response));

server
  .echo([1,2,3])
  .then((response) => console.log("server response:", response));


server
  .foo()
  .then((response) => console.log("server response:", response));