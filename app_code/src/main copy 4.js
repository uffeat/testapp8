import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";

// TODO form
// ... then dropdown and popover
// ... then ProgressiveImage
// ... then nav bar

create("", { id: "root", parent: document.body });

import { mixin } from "rollo/utils/mixin";
import { Collapse } from "bootstrap";

function Collapsible({ open = false, ...updates } = {}, ...hooks) {
  const self = create("div.collapse", { attr_constructorName: "Collapsible" });

  let controller;
  const initialize = () => {
    if (controller) {
      throw new Error(`'initialize' can only be called once.`);
    }
    controller = new Collapse(self);
  };

  /* Protect value state */
  //const set_open = self.reactive.protected.add("open");

  self.$.open = open;

  if (open) {
    initialize();
  } else {
    /* Bootstrap cannot handle JS-initialized collapse components with a hidden 
    start state. Therefore postpone init until first call to open. */
    self.effects.add(
      function effect(data) {
        initialize();
        self.effects.remove(effect);
      },
      { open: true }
    );
  }

  self.effects.add((data) => {
    controller && controller[self.$.open ? "show" : "hide"]();
  }, "open");

  /* Create external API */
  mixin(
    self,
    class {
      get open() {
        return this.$.open;
      }
      set open(open) {
        //set_open(value);
        this.$.open = open;
      }
    }
  );

  self.update(updates);
  self.call(...hooks);

  return self;
}

const content = create("h1", {}, "Foo");
const collapsible = Collapsible(
  {
    parent: root,
    //open: true,
  },
  content
);

const show_button = create(
  "button.btn",
  {
    parent: root,
    on_click: (event) => {
      collapsible.open = true;
    },
  },
  "Show"
);
const hide_button = create(
  "button.btn",
  {
    parent: root,
    on_click: (event) => {
      collapsible.open = false;
    },
  },
  "Hide"
);

if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
