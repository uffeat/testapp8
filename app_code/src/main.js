import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";

await import("rollo/components/css_rule");
await import("rollo/components/css_sheet");

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

/* Create elements to test css on */
create("h1", { parent: root }, "Hello World");
create("h2", { parent: root }, "Also hello from here");

const my_sheet = create(
  "css-sheet",
  { name: "my_sheet", parent: root },
  create("css-rule", {
    name: "my_rule",
    h1: {
      color: "pink",
      backgroundColor: "linen",
      padding: "8px",
      border: "4px solid red",
      animationDuration: "3s",
      animationName: "slide_in",
    },
  })
);

const my_rule = my_sheet.querySelector("css-rule");

my_rule.effects.add((changes, previous) => {
  //console.log('changes:', changes)////
})



my_rule.update({color: 'green'})
//my_rule.$.color = 'brown'
//my_rule.rule = {h2: {color: 'orange'}}
//my_rule.rule = {color: 'orange'}

console.log("css:", my_sheet.text);
my_rule.remove()
my_sheet.append(my_rule)

console.log("css:", my_sheet.text);



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
