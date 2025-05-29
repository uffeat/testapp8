/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

const { component, State } = await use("@/rollocomponent/");

const my_component = component.div(
  { state: State(), parent: document.body, host: true },
  component.h1({
    key: "headline",
    effect: function (change) {
      this.text = change.text;
    },
  })
);

my_component.state.update({ text: "Hello" });

const headline = my_component.find('h1')

console.log("headline:", headline);
console.log("headline.state:", headline.state);

console.info("Vite environment:", import.meta.env.MODE);
