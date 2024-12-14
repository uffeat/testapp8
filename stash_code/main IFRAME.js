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

const iframe_window = await new Promise((resolve, reject) => {
  root.append(iframe);
  iframe.addEventListener("load", (event) => {
    resolve(iframe.contentWindow);
  });
});

////console.log(iframe_window);////
////console.log(iframe_window.document);////

//const sheet = new CSSStyleSheet()
//iframe_window.document.adoptedStyleSheets.push(sheet)

////console.log(iframe_window.document.sheet);////

const sheet = iframe_window.document.sheet

sheet.replaceSync(`
  @media (width = 500px) {

    h1 {
      background-color: pink;
    }
  
  }

  :root:(has(h1)) {
    --foo: 'FOO';
  }

  



  h1 {
  color: pink;
  }
  
  `)


// add effect
const width_media_query_list = iframe_window.matchMedia("(width = 500px)");
width_media_query_list.addEventListener("change", (event) => {
  console.log('match')
});

// set state
iframe.style.width = '500px'







const headline = create("h1", {}, "Hello World");
iframe_window.document.body.append(headline)









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
