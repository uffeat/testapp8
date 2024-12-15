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

const my_sheet = create("css-sheet", { name: "my_sheet", parent: root,})

const my_static = create("css-static", {
  name: "my_static",
  parent: my_sheet,
  config: {
    h1: {
      color: "pink",
      backgroundColor: "linen",
      padding: "8px",
      animationDuration: "3s",
      animationName: "slide_in",
    },
    h2: { color: "blue" },
    "@keyframes slide_in": {
      "0%": { translate: "150vw 0", scale: "200% 1" },
      "100%": { translate: "0 0", scale: "100% 1" },
    },
    "@media (max-width: 300px)": { h2: { color: "red" } },
  },
});

//my_static.remove()
//my_sheet.remove()

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
