import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";

// TODO email and number

create("", { id: "root", parent: document.body });

await (async () => {
  const { create } = await import("rollo/component");
  const { Floating } = await import("rolloui/form/Floating");
  const { InvalidFeedback } = await import("rolloui/form/InvalidFeedback");
  const { TextInput } = await import("rolloui/form/input/TextInput");
  const { Label } = await import("rolloui/form/Label");

  const form = create(
    "form.d-flex.flex-column.row-gap-3.p-3",
    { parent: root, noValidate: true },
    create(
      "SECTION",
      {},
      Label({ for_name: "my_name" }, "My name"),
      TextInput({
        name: "my_name",
        required: true,
        min: 3,
        validations: [
          function () {
            if (this.value !== "uffe") {
              return "Not uffe";
            }
          },
        ],
      }),
      InvalidFeedback({for_name: 'my_name'}),
    ),
    Floating(
      { label: "Foo" },
      TextInput({ name: "foo", required: true }),
      InvalidFeedback(),
      /* Connect invalid feedback to input */
      function () {
        this.querySelector(".invalid-feedback").form_control =
          this.querySelector("input");
      }
    ),
    create(
      "DIV.input-group",
      {},
      create("SPAN.input-group-text", {}, "@"),
      Floating(
        { label: "Bar" },
        TextInput({ name: "bar", required: true, ["css_rounded-end"]: true })
      ),
      InvalidFeedback({for_name: 'bar'}),
      
    ),
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
