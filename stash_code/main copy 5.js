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
  "button.btn",
  {
    parent: root,
    $$text: "Hello World",
    $foo: "FOO",
    //observe: true,
    attribute_bar: 'BAR',
    //$$attribute_bar: "BAR",
    '.btn-primary': true,
    //'$$.btn-primary': true
    on_click: (event) => {
      console.log("Clicked");
    },
  },
  //".btn-primary"
  //'$.btn-primary'
);

//button.$['$.btn-primary'] = true
//button.css_classes.add('.btn-primary')
//button.$['$.btn-primary'] = true
//button.css_classes.add('$.btn-primary')

button.effects.add((data) => {
  ////console.log("foo:", button.$.foo);////
}, "foo");

button.effects.add((data) => {
  console.log("__connected__:", button.$.__connected__);////
}, "__connected__");



button.$.foo = "FOOFOO";

const my_paragraph = create("p", {}, "Some text");
my_paragraph.effects.add((data) => {
  console.log("Previous parent state:", data.__parent__.previous);
  console.log("Current parent state:", data.__parent__.current);
}, "__parent__");

button.append(my_paragraph);

my_paragraph.remove();

setTimeout(() => {
  //my_paragraph.$.parent = 42
}, 0);

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
