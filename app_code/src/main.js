import "./bootstrap.scss";
import "./main.css";
import { Component, create } from "rollo/component";

import { Reactive } from "rollo/reactive";

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

const root = create("DIV", { id: "root", parent: document.body });

/* Create state items container */
const state = document.createElement("div");
state.setAttribute("state", "");
state.setAttribute("name", "my_state");

state._current_attributes = {};
state._previous_attributes = {};

const observer = new MutationObserver((mutations, observer) => {
  mutations
    .filter((mutation) => mutation.type === "attributes")
    

    .forEach((mutation) => {
      const name = mutation.attributeName;
      const previous = (state._previous_attributes[name] =
        state._current_attributes[name]);
      const current = (state._current_attributes[name] =
        state.getAttribute(name));

        
      if (previous !== current) {
        console.log(`Attribute ${name} was modified`);
        console.log(`Current value: ${current}`);
        console.log(`Previous value: ${previous}`);

        
      }
    });
});

observer.observe(state, {
  attributes: true,
});

state.setAttribute("foo", "FOO");
state.setAttribute("foo", "FOO");
state.setAttribute("foo", "FOOFOO");
state.setAttribute("bar", "bar");



root.append(state);

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
