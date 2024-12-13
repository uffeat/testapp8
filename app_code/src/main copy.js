import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";

await import("rollo/components/css/css_frames");
await import("@/rollo/components/css/css_frame");
await import("rollo/components/css/css_media");
await import("rollo/components/css/css_rule");
await import("rollo/components/css/css_sheet");
await import("rollo/components/css/css_static");

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
      animationDuration: "3s",
      animationName: "slide_in",
    },
  }),
  create(
    "css-media",
    {
      media: "600px <= width <= 800px",
      name: "my_rule",
    },
    create("css-rule", {
      name: "my_media_rule",
      h1: {
        backgroundColor: "yellow !important",
        border: "4px solid red",
      },
    })
  ),
  create(
    "css-frames",
    {
      name: "slide_in",
    },
    create("css-frame", {
      name: "my_frame",
      0: { translate: "150vw 0", scale: "200% 1" },
    }),
    create("css-frame", { frame: 100, translate: "0 0", scale: "100% 1" })
  )
);

//my_sheet.disabled = true;
//my_sheet.disabled = false;
//my_sheet.remove()

const my_rule = my_sheet.querySelector(`css-rule[name="my_rule"]`);
const slide_in = my_sheet.querySelector(`css-frames[name="slide_in"]`);
const my_frame = my_sheet.querySelector(`css-frame[name="my_frame"]`);

//my_rule.remove()////
//console.log('my_rule.text:', my_rule.text)

//const my_rule_clone = my_rule.clone()
//my_rule.remove()////
//my_sheet.append(my_rule_clone)

//my_rule.update({ color: "green" });
//my_rule.$.color = 'brown'
//my_rule.rule = { h2: { color: "orange" } };
//my_rule.rule = {color: 'orange'};

//console.log("css:", my_sheet.text);
//my_rule.remove();
//my_sheet.append(my_rule);

//console.log("css:", my_sheet.text);

//my_frame.update({ color: "green" });
//my_frame.rule = {color: 'green', translate: "150vw 0", scale: "200% 1"};
//my_frame.rule = { 50: {color: 'green', translate: "150vw 0", scale: "200% 1"}}

my_frame.remove();
slide_in.append(my_frame);
console.log("my_frame.text:", my_frame.text);

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
