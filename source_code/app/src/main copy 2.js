import "./bootstrap.scss";
import "./main.css";
import { create } from "utils/component";
import { assets } from "utils/assets";

function element_to_component(element) {
  const component = create(element.tagName.toLowerCase());
  Array.from(element.attributes).forEach((attr) =>
    component.setAttribute(attr.name, attr.value)
  );
  component.append(...element.childNodes);
  element.replaceWith(component);
}

function convert_descendants(element) {
  const descendants = [...element.querySelectorAll("*")];
  if (descendants.length === 0) {
    element_to_component(element);
  } else {
    for (const descendant of [...descendants]) {
      element_to_component(descendant);
      convert_descendants(descendant);
    }
  }
}

const foo_html = await assets.get("foo.html");
const wrapper = document.createElement("div");
wrapper.innerHTML = foo_html;

convert_descendants(wrapper);

console.log(wrapper.innerHTML); ////

create("button.btn.btn-primary", { parent: root }, "Yo World!");

if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}


/*
<div is="native-div" web-component="" class="foo" foo="42" data-foo="42" bar="" data-bar="" style="background-color: pink">
  <h1>Hello from <span>foo</span>!</h1>
  <button class="btn btn-success" onclick="console.log('CLICKED')">
    Click
  </button>
</div>

*/