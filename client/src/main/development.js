import { component } from "@/rollocomponent/component.js";

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
