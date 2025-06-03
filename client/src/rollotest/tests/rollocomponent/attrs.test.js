/*
rollocomponent/attrs
*/

import { component } from "@/rollocomponent/component.js";

const headline = component
  .h1({
    parent: document.body,

    text: "FOO",
    "[stuff": "STUFF",
  })

  .attributes.update({ fooBar: true, dingDong: 42, thing: "THING" });

console.log("fooBar:", headline.attributes.get("fooBar"));
console.log("fooBar:", headline.attribute.fooBar);

console.log("dingDong:", headline.attributes.get("dingDong"));
console.log("dingDong:", headline.attribute.dingDong);

console.log("thing:", headline.attributes.get("thing"));
console.log("thing:", headline.attribute.thing);

console.log("nogo:", headline.attributes.get("nogo"));
console.log("nogo:", headline.attribute.nogo);

console.log(headline);

console.log("entries:", headline.attributes.entries());
