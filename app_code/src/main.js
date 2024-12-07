import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";
import "rollo/components/static_sheet";


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
  '.btn-primary',
  function () {
    this.effects.add((data) => {
      console.log('$text:', this.$.$text)
    }, '$text')
  }
);

button.$.$text = 'Yo world'
//button.$['$.btn-primary'] = true

create("h1", { parent: root }, "Hello World");
create("h2", { parent: root }, "Also hello from here",  create('span', {text: "I'm injected"}),);

const my_sheet = create("data-static-sheet", {parent: root, h1: {color: 'pink'}})









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
