/*
rollocomponent/vars
*/

import { component } from "@/rollocomponent/component.js";

const connected = component.h1({
  parent: document.body,
  text: "FOO",
  __height: "100%",
  __color: "hotpink",
});

console.log(connected);
console.log(connected.vars.color);
console.log(connected.vars.height);

connected.vars.foo = "pink !important";
console.log(connected.vars.foo);
console.log(connected.vars.bar);


const unconnected = component.h1({
  text: "FOO",
  __height: "100%",
  __color: "hotpink",
});

console.log(unconnected);
console.log(unconnected.vars.color);
console.log(unconnected.vars.height);

unconnected.vars.foo = "pink !important";
console.log(unconnected.vars.foo);
console.log(unconnected.vars.bar);
