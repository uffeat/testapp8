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


const iframe = await new Promise((resolve, reject) => {
  const iframe = document.createElement("iframe");
  iframe.srcdoc = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title></title>
      <script type="module">
        const sheet = new CSSStyleSheet()
        document.adoptedStyleSheets.push(sheet)
        document.sheet = sheet
      </script>
    </head>
    <body></body>
  </html>`;
  document.head.append(iframe);
  iframe.addEventListener("load", (event) => {
    iframe.contentDocument.sheet.replaceSync(`
      @keyframes donothing {
        from { opacity: 1; }
        to { opacity: 1; }
      }
    `);
    resolve(iframe);
  });
});



let uid = 0

export function create_uniquie_class_name() {
  return `uid${uid++}`
}



/* sheet triggers effects */
const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  @keyframes donothing {
    from { opacity: 1; }
    to { opacity: 1; }
  }

  
  }
`);

sheet.add = (selector) => {
  sheet.insertRule(`${selector} { animation: donothing 1ms; }`, sheet.cssRules.length);
}
 

document.adoptedStyleSheets.push(sheet);

/* Create state items container */
const state = document.createElement("div");
state.setAttribute("state", "");
state.setAttribute("name", "my_state");

function handler(mutations) {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      [...mutation.addedNodes]
        .filter((node) => node instanceof HTMLElement)
        .forEach((node) => {
          /* node is the child added */
          console.log("Child element added:", node);
        });
      [...mutation.removedNodes]
        .filter((node) => node instanceof HTMLElement)
        .forEach((node) => {
          /* node is the child removed */
          console.log("Child element removed:", node);
        });
    }
  });
}
const mutation_observer = new MutationObserver(handler);
mutation_observer.observe(state, {
  childList: true,
  subtree: false,
});

root.append(state);

/* Add state item */
const foo = document.createElement("data");
foo.setAttribute("name", "foo");
foo.setAttribute("value", "FOO");
state.append(foo);

/* Add effect */
const effect = document.createElement("div");
effect.classList.add('stuff')
effect.setAttribute("effect", "");
effect.setAttribute("name", "FOO");

effect.selector = `div[state]:has(data[name="foo"]) div[effect].stuff`
sheet.add(effect.selector)


effect.function = (event) => {
  console.log(effect.parentElement)
  console.log("From foo effect");
};


effect.addEventListener("animationstart", effect.function)





state.append(effect);

setTimeout(() => {
  foo.remove()
}, 10)

setTimeout(() => {
  state.append(foo);
}, 10)








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
