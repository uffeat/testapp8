import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";
import "rollo/components/css_sheet";
import "rollo/components/css_rule";
import "rollo/components/css_items";

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

const my_sheet = create("css-sheet", { name: "my_sheet", parent: root });
const my_rule = create("css-rule", {
  selector: "h1",
  name: "my_rule",
  parent: my_sheet,
});




const my_items = create("css-items", {
  name: "my_items",
  parent: my_rule,
  color: "pink",
  backgroundColor: 'linen',
});

my_items.update({backgroundColor: 'yellow'})

my_items.remove()
my_rule.append(my_items)

my_rule.remove()
my_sheet.append(my_rule)

my_items.$.$color = 'red'

my_items.effects.add((data) => {
  console.log('The color is:', my_items.$.$color)
}, '$color')

console.log('css:', my_sheet.text)

my_items.$.$color = 'green'

console.log(my_items.items)






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
