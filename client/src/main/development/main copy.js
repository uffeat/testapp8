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



const uffe = Input({
  parent: document.body,
  name: "uffe",
  
  required: true,
  validators: [
    (value) => {
      if (value !== "uffe") {
        return "Not uffe";
      }
    },
  ],
  
});

uffe.message.add((current) => {
  console.log('message for uffe:', current)
}, {run: true})

const number = Input({
  parent: document.body,
  name: "number",
  type: 'numeric',
  required: true,
})

number.message.add((current) => {
  console.log('message for number:', current)
}, {run: true})


const email = Input({
  parent: document.body,
  name: "email",
  type: 'email',
  required: true,
})

email.message.add((current) => {
  console.log('message for email:', current)
}, {run: true})


