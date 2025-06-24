import "@/rollotest/__init__.js";


console.info("Vercel environment:", import.meta.env.VERCEL_ENV);

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
