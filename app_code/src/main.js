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


await (async () => {
  const { create } = await import("rollo/component");
  const { FileInput } = await import("rolloui/form/input/FileInput");

  const form = create(
    "form.d-flex.flex-column.row-gap-3.p-3",
    { parent: root, noValidate: true },
    FileInput({ label: "Foo", name: "foo", required: true }),
    FileInput({ label: "Bar", name: "bar", multiple: true, required: true }),
    FileInput({
      label: "Stuff",
      name: "stuff",
      floating: true,
      multiple: true,
      required: true,
    })
  );
})();

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
