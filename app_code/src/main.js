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



const root = create("div", {
  id: "root",
  parent: document.body,
});

const button = create(
  "button",
  {
    parent: root,
    $$text: "Hello World",
    $foo: "FOO",
    //observe: true,
    //attribute_bar: 'BAR',
    $$attribute_bar: "BAR",
    //'.btn.btn-primary': true,
    //'$$.btn.btn-primary': true,
    on_click: (event) => {
      console.log("Clicked");
    },
  },
  //".btn.btn-primary"
  '$.btn.btn-primary'
);

button.effects.add((data) => {
  console.log(button.$['$.btn.btn-primary'])
})

button.$['$.btn.btn-primary'] = false
button.$['$.btn.btn-primary'] = true







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
