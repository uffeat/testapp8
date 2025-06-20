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


console.log('size:', uffe.state.effects.size)


uffe.state.effects.add(
  (change, {index, state}) => {

    console.log('size:', state.effects.size)
    console.log('session:', state.session)
    console.log('index:', index)

    console.log('current:', state.current)
    console.log('previous:', state.previous)

    //console.log('change:', change)


    //console.log("message for uffe:", change.message);
  },
  //["message"],
  
  { run: true }
);

console.log('size:', uffe.state.effects.size)


/*



const number = Input({
  parent: document.body,
  name: "number",
  type: "numeric",
  required: true,
});

number.state.effects.add(
  (change) => {
    //console.log("message for number:", change.message);
  },
  ["message"],
  { run: true }
);

const email = Input({
  parent: document.body,
  name: "email",
  type: "email",
  required: true,
});

email.state.effects.add(
  (change) => {
    //console.log("message for email:", change.message);
  },
  ["message"],
  { run: true }
);

*/
