import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

console.info("Vite environment:", import.meta.env.MODE);

document.querySelector("html").dataset.bsTheme = "dark";

import { component } from "@/rollocomponent/component.js";
await use("/app.x.html");
const { Pop } = await use("/rollolibs/bootstrap/pop.x.html");

const button = component.button("btn.btn-primary", {}, "Pop");

const menu = component.menu("flex.justify-end", { parent: app }, button);

const inner = component.button(
  "btn.btn-warning",
  {
    "@click": (event) => {
      console.log("inner clicked");
    },
  },
  "Inner"
);

const pop = new Pop(button, { content: inner });
