/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

console.info("Vite environment:", import.meta.env.MODE);

document.querySelector("html").dataset.bsTheme = "dark";

const Input = await use("@/components/form/input.x.html");

const uffe = Input({
  parent: document.body,
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
});

//uffe.value = 'uff'

uffe.states.main.effects.add(
  (change) => {
    console.log("message:", change.message);
  },
  ["message"],
  { run: true }
);

uffe.states.value.effects.add((current) => {
  console.log("value:", current);
},{ run: true });

const number = Input({
  parent: document.body,
  name: "number",
  type: "numeric",
  required: true,
});

number.states.main.effects.add(
  (change) => {
    console.log("message:", change.message);
  },
  ["message"],
  { run: true }
);

number.states.value.effects.add((current) => {
  console.log("value:", current);
},
 { run: true }
);

const email = Input({
    parent: document.body,
    name: "email",
    type: "email",
    required: true,
  });


email.states.main.effects.add(
  (change) => {
    console.log("message:", change.message);
  },
  ["message"],
  { run: true }
);

email.states.value.effects.add((current) => {
  console.log("value:", current);
},
 { run: true }
);
