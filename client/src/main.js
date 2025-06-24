

import "@/rollovite/__init__.js";
import "@/app.js";
import "@/rollotest/__init__.js";

document.querySelector("html").dataset.bsTheme = "dark";

console.info(
  "Environment:",
  import.meta.env.DEV ? "development" : import.meta.env.VERCEL_ENV
);

const { component } = await use("@/rollocomponent/");

console.log('HERE')

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