import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";



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

import { Sheet } from "rollo/components/sheet";



const root = create("div", {
  id: "root",
  parent: document.body,
});

////
const button = create(
  "button",
  {
    parent: root,
    text: "Hello World",
    
    on_click: (event) => {
      console.log("Clicked");
    },
  },
  
);

//const sheet_component = new Sheet()
//button.append(sheet_component)

//button.style['background-color'] = 'pink'

button.rules.add({'': {'background-color': 'pink'}})
button.rules.add({':hover': {'background-color': 'green'}})



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
