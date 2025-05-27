/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

import { component } from "@/rollocomponent/component.js";

console.info("Vite environment:", import.meta.env.MODE);

const headline = component
  .h1(
    "foo.bar",
    { parent: document.body, text: "FOO" },
    component.span({}, "...hi!"),
    () => console.log("Hook says hi!")
  )
  .handlers.add({
    click$run: (event) => console.log("Clicked!"),
  })
  .attrs.set({ fooBar: true, dingDong: 42, thing: "THING" });

console.log("fooBar:", headline.attrs.get("fooBar"));
console.log("fooBar:", headline.attribute.fooBar);


console.log("dingDong:", headline.attrs.get("dingDong"));
console.log("dingDong:", headline.attribute.dingDong);


console.log("thing:", headline.attrs.get("thing"));
console.log("thing:", headline.attribute.thing);


console.log("nogo:", headline.attrs.get("nogo"));
console.log("nogo:", headline.attribute.nogo);

//headline.text = 'foo'
//headline.update({text: 'bar'})

console.log(headline);
