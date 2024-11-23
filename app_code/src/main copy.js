import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";

create("", { id: "root", parent: document.body });

await (async () => {
  const { create } = await import("rollo/component");
  const { TextInput } = await import("rolloui/form/input/TextInput");
  const { ErrorFeedback, connect } = await import("rolloui/form/ErrorFeedback");

  const form = create(
    "form.d-flex.flex-column.row-gap-0.p-3",
    { parent: root, noValidate: true },
    function () {

      const text_input = TextInput({
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
      })

      const error_feedback = ErrorFeedback()
      return connect(text_input, error_feedback)

    },
    
    
  );

  const my_name = form.get('input[name="my_name"]')[0];
  ////my_name.value = "rufus";

  my_name.effects.add((data) => {
    ////console.log('Value state is:', my_name.value);
  }, 'value')

 
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
