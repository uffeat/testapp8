import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";
import "rollo/components/static_sheet";
//import "rollo/components/data_rule";
//import "rollo/components/data_media_rule";
import { DataRule, DataMediaRule } from "rollo/components/data_rule";

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
});

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
  ".btn-primary",
  function () {
    this.effects.add((data) => {
      console.log("$text:", this.$.$text);
    }, "$text");
  }
);

button.$.$text = "Yo world";
//button.$['$.btn-primary'] = true

create("h1", { parent: root }, "Hello World");
create(
  "h2",
  { parent: root },
  "Also hello from here",
  create("span", { text: "I'm injected" })
);

const my_sheet = create("data-static-sheet", {
  parent: root,
  name: 'my_sheet',
  h1: {
    color: "pink",
    backgroundColor: "linen",
  },
  "@media (width <= 600px)": {
    div: {
      backgroundColor: "pink",
    },
  },
});

//const my_rule = create('data-rule', 'h1', my_sheet.sheet, {h1: {color: 'green'}})
const my_rule = new DataRule(my_sheet.sheet,  'h1', {color: 'green'})
const my_media_rule = new DataMediaRule(my_sheet.sheet,  '@media (width <= 600px)', {h1: {color: 'blue'}})
//const my_media_rule = create('data-media-rule', {selector: '@media (width <= 600px)', sheet: my_sheet.sheet, h1: {color: 'blue'}})


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
