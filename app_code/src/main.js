import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";
import "@/rollo/components/data_sheet";
import "rollo/components/data_rule";
import "rollo/components/data_media_rule";
import "rollo/components/data_keyframes_rule";

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

const my_sheet = create("data-sheet", {
  parent: root,
  name: "my_sheet",
  h1: {
    color: "pink",
    backgroundColor: "linen",
    animationDuration: "3s",
    animationName: "slide_in",
  },
  "@media (width <= 600px)": {
    div: {
      backgroundColor: "pink",
    },
  },
  "@keyframes slide_in": {
    from: {
      translate: "150vw 0",
      scale: "200% 1",
    },

    to: {
      translate: "0 0",
      scale: "100% 1",
    },
  },
});

const my_rule = create("data-rule", {
  sheet: my_sheet.sheet,
  h1: { color: "green", margin: "4px" },
});
my_rule.update({ padding: "4px" });

console.log(my_rule.text);
console.dir(my_rule.rule);

const my_media_rule = create("data-media-rule", {
  sheet: my_sheet.sheet,
  "@media (width <= 600px)": { h1: { color: "blue" } },
});

my_media_rule.update({
  h1: { border: "4px solid blue" },
  h2: {
    animationDuration: "5s",
    animationName: "do_stuff",
  },
});

console.log(my_media_rule.text);
console.dir(my_media_rule.rule);

my_sheet.append(
  create("data-keyframes-rule", { name: "do_stuff" }, function () {
    return function () {this.update({
      from: {
        translate: "150vw 0",
        scale: "200% 1",
      },
      to: {
        translate: "0 0",
        scale: "100% 1",
      },
    });};

    
  })
);
/*
const my_keyframes_rule = create("data-keyframes-rule", {
  sheet: my_sheet.sheet,
  name: 'do_stuff',
  from: {
    translate: "150vw 0",
    scale: "200% 1",
  },

  to: {
    translate: "0 0",
    scale: "100% 1",
  },
});
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
