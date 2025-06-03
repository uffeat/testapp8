/*
rollocomponent/classes
*/

import { component } from "@/rollocomponent/component.js";

const headline = component.h1("foo.bar", {
  parent: document.body,
  ".stuff": true,
});

console.log(headline);
