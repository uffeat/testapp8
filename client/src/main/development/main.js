/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

const { component, State } = await use("@/rollocomponent/");

const my_component = component.div(
  { state: State(), parent: document.body, host: true },
  component.h1(
    {
      key: "headline",
     
    },
    component.span(
      {
        effect: function (change) {
          this.text = change.text
        },
      },
      'foo'
     
    )
  )
);

my_component.state.update({ text: "Hello" });

const span = my_component.find("span");

console.log("span:", span);
console.log("span.state:", span.span);

console.info("Vite environment:", import.meta.env.MODE);
