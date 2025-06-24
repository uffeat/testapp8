document.querySelector("html").dataset.bsTheme = "dark";

import { component } from "@/rollocomponent/component.js";

const InputControl = await use("/components/form/input_control.x.html");

const uffe = InputControl(
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
  component.span({ slot: "start" }, "@")
);
