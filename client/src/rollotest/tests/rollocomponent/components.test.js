/*
rollocomponent/components
*/

import { component } from "@/rollocomponent/component.js";

const headline = component.h1(
  "foo.bar",
  { host: true, parent: document.body, text: "FOO" },
  component.span(
    {
      key: "span",
    },
    "...hi!"
  )
);

console.log("span:", headline.components.span);

console.log(headline);
