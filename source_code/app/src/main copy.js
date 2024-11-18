import "./bootstrap.scss";
import "./main.css";
import { create } from "utils/component";
import { assets } from "utils/assets";

function get_attributes(element) {
  return Object.fromEntries(
    Array.from(element.attributes).map((attr) => [attr.name, attr.value])
  );
}

function set_attributes(element, attributes = {}) {
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
}

function assign_attributes(target, source) {
  Array.from(source.attributes).forEach((attr) =>
    target.setAttribute(attr.name, attr.value)
  );
}

function replace_with_component(element) {
  const component = create(element.tagName.toLowerCase());
  Array.from(element.attributes).forEach((attr) =>
    component.setAttribute(attr.name, attr.value)
  );
  const children = Array.from(element.children);
  component.append(...children);
  element.replaceWith(component);
}

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
////console.log(foo_html)////

const wrapper = document.createElement("div");
wrapper.innerHTML = foo_html;

convert_descendants(wrapper);

console.log(wrapper); ////

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
