import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

console.info("Vite environment:", import.meta.env.MODE);

document.querySelector("html").dataset.bsTheme = "dark";

import { component } from "@/rollocomponent/component.js";

const Help = await use("/icons/help.icon.svg");





const InputControl = await use("/components/form/input_control.x.html");

InputControl(
  {
    parent: document.body,
    label: "Your name",
    name: "uffe",
    required: true,
    validators: [
      (value) => {
        if (value !== "uffe") {
          return "Not uffe";
        }
      },
    ],
  },
  component.span({ slot: "start" }, "@"),
  component.button(
    { slot: "end", "@click": (event) => console.log("Clicked") },
    Help({size: 24, color: 'pink'})
  )
);
