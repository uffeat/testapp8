import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";

await import("rollo/components/css_media");
await import("rollo/components/css_rule");
await import("rollo/components/css_sheet");
await import("rollo/components/css_keyframes");
await import("rollo/components/css_keyframe");

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
  ),
  create(
    "css-keyframes",
    {
      name: "slide_in",

      /*
      from: {
        translate: "150vw 0",
        scale: "200% 1",
      },

      to: {
        translate: "0 0",
        scale: "100% 1",
      },
      */
    },
    create("css-keyframe", { frame: 0, translate: "150vw 0", scale: "200% 1" }),
    create("css-keyframe", { frame: 100, translate: "0 0", scale: "100% 1" }),
    
  )
);

const my_media = my_sheet.querySelector("css-media");
const my_rule = my_sheet.querySelector("css-rule");
const slide_in = my_sheet.querySelector("css-keyframes");
const css_keyframe_0 = my_sheet.querySelector('css-keyframe[frame="0"]');
const css_keyframe_100 = my_sheet.querySelector(
  'css-keyframe[frame="100"]'
);

css_keyframe_100.update({scale: "10% 1"})


////console.dir(css_keyframe_0.rule.style); ////


//css_keyframe_0.frame = 50

////console.log("css_keyframe_0.rule:", css_keyframe_0.rule);////
//slide_in.rules.remove(css_keyframe_0.rule)



////console.log("slide_in:", slide_in.rule);////

//console.dir(slide_in.rule)////

//console.log('Found rule', slide_in.rule.findRule('0%'))

/*
slide_in.rule.appendRule(`
  from {
      translate: 150vw 0;
      scale: 200% 1;
  }
`);
slide_in.rule.appendRule(`
  to {
    translate: 0 0;
    scale: 100% 1;
  }
`);
*/

//
//my_rule.remove()
//my_rule.selector = 'h2'
//my_rule.update({color: "green"})
//my_media.append(my_rule)
my_rule.$.$color = "blue";

//my_rule.update({$$color: "gray"})
//my_rule.style.color = "green";

//my_rule.items = {color: 'brown'}
//my_rule.rule = {h2: {color: 'brown'}}

console.log("css:", my_sheet.text);

//my_media.remove()
//console.log('css:', my_sheet.text)
//my_sheet.append(my_media)
//console.log('css:', my_sheet.text)

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
