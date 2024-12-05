import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";
import "rollo/components/reactive";

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

//import { Sheet } from "rollo/components/sheet";

const root = create("div", {
  id: "root",
  parent: document.body,
});

////
const reactive = create("data-reactive", {
  name: "my_reactive",
  parent: root,
  $foo: 40,
  attribute_bar: 'bar'
});

reactive.effects.add((data) => {
  console.log("foo:", reactive.$.foo);
}, "foo");

reactive.$.foo = 42;
reactive.$.foo = 43;

const button = create("button", {
  parent: root,
  text: "Hello World",
  attribute_foo: "FOO",
  ".btn": true,
  on_click: (event) => {
    console.log("Clicked");
  },
},

);

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
