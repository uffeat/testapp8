/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

console.info("Vite environment:", import.meta.env.MODE);

document.querySelector("html").dataset.bsTheme = "dark";

import { component } from "@/rollocomponent/component.js";

const Input = await use("@/components/form/input.x.html");
const email = Input({
  parent: document.body,
  name: "email",
  label: "Email",
  required: true,
  type: "email",
  min: 8,
});

const uffe = Input({
  parent: document.body,
  name: "uffe",
  label: "Uffe",
  required: true,
  validators: [
    (value) => {
      if (value !== "uffe") {
        return "Not uffe";
      }
    },
  ],
});

//uffe.on.invalid = (event) => console.log(event)

const numeric = Input({
  parent: document.body,
  name: "numeric",
  label: "Numeric",
  required: true,
  type: "numeric",
  min: 3,
  max: 10,
});

component.button({ parent: document.body }, "stuff");

/*
const Login = await use("@/components/login.x.html");
const login = Login({ parent: document.body });
*/
