import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";

await import("rollo/components/css_items");
await import("rollo/components/css_media");
await import("rollo/components/css_rule");
await import("rollo/components/css_sheet");

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

/* Create elements to test css on */
create("h1", { parent: root }, "Hello World");
create("h2", { parent: root }, "Also hello from here");

/* Build sheet */
const my_sheet = create(
  "css-sheet",
  { name: "my_sheet", parent: root },
  create(
    "css-media",
    {
      media: "600px <= width <= 800px",
      name: "my_rule",
    },
    create(
      "css-rule",
      {
        selector: "h1",
        name: "my_rule",
        color: "pink",
        backgroundColor: "linen",
        padding: '8px',
        border: '4px solid red',
      }
    )
  )
);

const my_media = my_sheet.querySelector("css-media");
const my_rule = my_sheet.querySelector("css-rule");


//
my_rule.remove()
my_rule.selector = 'h2'
my_rule.update({color: "green"})
my_media.append(my_rule)

my_rule.$.$color = "blue";
my_rule.update({$$color: "gray"})



console.log('css:', my_sheet.text)






/*


my_media.append(my_rule)
*/
//
//my_rule.style.color = "green";
//


/*
my_media.remove()
console.log('css:', my_sheet.text)
my_sheet.append(my_media)
console.log('css:', my_sheet.text)
*/



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
