import "./bootstrap.scss";
import "./main.css";
import { Component, create } from "rollo/component";

import { Reactive } from "rollo/reactive";

// TODO
// ... then nav bar
// ... then Accordion
// ... then form
// ... then dropdown and popover
// ... then ProgressiveImage

// ... then loader
// ... then carousel
// ... then placeholder
// ... then tooltip
// ... then scrollspy

const root = create("div", {
  id: "root",
  parent: document.body,
  on_click: (event) => {
    console.log("Clicked");
  },
});
const button = create(
  "button.btn",
  { 
    parent: root, 
    $$text: "Hello World", 
    $foo: "FOO", 
    attribute_bar: 'BAR',
    //'.btn-primary': true,
    },
  function () {
    console.log(this);
  }
);

button.css_classes.add('btn-primary')



button.effects.add((data) => {
  console.log("foo:", button.$.foo);
}, "foo");

button.$.foo = "FOOFOO";

/* Enable tests */
if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
