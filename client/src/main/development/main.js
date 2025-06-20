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

  required: true,
  validators: [
    (value) => {
      if (value !== "uffe") {
        return "Not uffe";
      }
    },
  ],
});

uffe.state.effects.add(
  (change) => {
    console.log("message:", change.message);
  },
  ["message"], {run: true}
);
