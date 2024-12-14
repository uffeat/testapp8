import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";
import "@/rollo/components/data/data_reactive";
import "@/rollo/components/data_sheet";
import "@/rollo/components/data_rule";

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

const my_sheet = create("data-sheet", {
  name: "my_sheet",
  parent: root,
});

my_sheet.text = `
h1 {
  background-color: pink;
}
`
my_sheet.disabled = true
my_sheet.disabled = false

const my_rule = create("data-rule", {
  name: "my_rule",
  selector: 'h1',
  parent: my_sheet,
  items: {
    color: 'red',
    border: '2px solid green'
  }

});

/*
my_rule.items = {
  color: 'red',
  border: '2px solid green'
}
*/



////my_rule.$.color = 'red'
////my_rule.$.border = '2px solid green'
//my_rule.update({$color: 'red', $border: '2px solid green'})














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
