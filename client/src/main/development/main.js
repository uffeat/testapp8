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

const number = Input({
  parent: document.body,
  name: "number",
  type: "numeric",
  required: true,
});

const Textarea = await use("@/components/form/textarea.x.html");

  const notes = Textarea({
    parent: document.body,
    name: "notes",
    required: true,
    resize: 'both'
  });
