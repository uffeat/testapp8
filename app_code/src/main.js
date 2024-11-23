import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";

// TODO email and number

create("", { id: "root", parent: document.body });

await (async () => {
  const { create } = await import("rollo/component");
  const { FileInput } = await import("rolloui/form/input/FileInput");

  const form = create(
    "form.d-flex.flex-column.row-gap-3.p-3",
    { parent: root, noValidate: true },
    FileInput({ label: "Foo", name: "foo", required: false }),
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

if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
