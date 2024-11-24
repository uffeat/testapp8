import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";

// TODO email and number

create("", { id: "root", parent: document.body });


await (async () => {
  const { create } = await import("rollo/component");
  const { CheckInput } = await import("rolloui/form/input/CheckInput");

  const form = create(
    "form.d-flex.flex-column.row-gap-3.p-3",
    { parent: root, noValidate: true },
    CheckInput({
      label: "Accept",
      name: "accept",
      required: true,
      toggle: true,
      value: true,
    }),
    CheckInput({ label: "Agree", name: "agree", required: false, value: true })
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
