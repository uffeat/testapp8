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

import { Sheet } from "rollo/components/sheet";

const root = create("div", {
  id: "root",
  parent: document.body,
});

////
const reactive = create("data-reactive", {
  name: "my_reactive",
  parent: root,
  $foo: 40,
  attribute_bar: "bar",
});

reactive.effects.add((data) => {
  console.log("foo:", reactive.$.foo);
}, "foo");

reactive.$.foo = 42;
reactive.$.foo = 43;

const button = create(
  "button",
  {
    parent: root,
    $$text: "Hello World",
    attribute_foo: "FOO",
    ".btn": true,
    on_click: (event) => {
      console.log("Clicked");
    },
  },
  function () {
    this.effects.add((data) => {
      console.log('$text:', this.$.$text)
    }, '$text')
  }
);

button.$.$text = 'Yo world'
button.$['$.btn-primary'] = true

create("h1", { parent: root }, "Hello World");
create("h2", { parent: root }, "Also hello from here");

const sheet_1 = Sheet.create(
  {
    name: "sheet_1",
  },
  function () {
    console.log("My hook");
  },
  {
    "@media (width <= 600px)": {
      div: {
        "background-color": "pink",
      },
    },
  },
  {
    h1: {
      "--color": "green !important",
      color: "var(--color)",
      backgroundColor: "linen",
      padding: "8px",
      border: "4px solid blue",
      animationDuration: '3s',
      animationName: "slide_in",
    },
  },
  { "h1:hover": { border: "4px solid green" } },
  {
    h2: {
      color: "blue",
      "background-color": "pink",
      border: "2px solid white",
    },
  },
  { "h2:hover": { border: "2px solid green" } },
  {
    "@keyframes slide_in": {
      from: {
        translate: "150vw 0",
        scale: "200% 1",
      },
      to: {
        translate: "0 0",
        scale: "100% 1",

      }
    },
  },
);


root.append(sheet_1);

sheet_1.disabled = true
sheet_1.disabled = false

console.log(sheet_1.text)




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
