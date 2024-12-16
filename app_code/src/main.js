import "./bootstrap.scss";
import "./main.css";

await (async () => {
  const { create } = await import("rollo/component");
  const { CheckInput } = await import("rolloui/form/input/CheckInput");

  create("div", {
    id: "root",
    parent: document.body,
  });

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
  const check_input = CheckInput({ label: "Foo", name: "foo" })
  console.log(check_input.name)
  console.log(check_input.value)
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
