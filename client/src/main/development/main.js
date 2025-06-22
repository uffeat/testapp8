/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

console.info("Vite environment:", import.meta.env.MODE);

document.querySelector("html").dataset.bsTheme = "dark";

import { component } from "@/rollocomponent/component.js";
//import Input from "/components/form/input.js";
const FormControl = await use("/components/form/form_control.x.html");

const uffe = FormControl({
    parent: document.body,
    label: "Uffe",
    name: "uffe",
    //value: 'uff',
    required: true,
    validators: [
      (value) => {
        if (value !== "uffe") {
          return "Not uffe";
        }
      },
    ],
  }, 
  component.span({slot: 'start'}, '@')
  );
