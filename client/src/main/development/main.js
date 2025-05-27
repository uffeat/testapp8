/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

import { component } from "@/rollocomponent/component.js";

console.info("Vite environment:", import.meta.env.MODE);

const headline = component.h1(
  "foo.bar",
  { parent: document.body, text: "FOO" },
  component.span({}, "...hi!"),
  () => console.log('Hook says hi!')
).handlers.add({
  click: (event) => console.log('Clicked!')
});

//headline.text = 'foo'
//headline.update({text: 'bar'})

console.log(headline);
