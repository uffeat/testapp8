import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";

// TODO number and select - and form
// ... then dropdown and popover
// ... then ProgressiveImage

create("", { id: "root", parent: document.body });

function to_number_text(value) {
  let decimal = false;
  return value
    .split("")
    .filter((c, i) => {
      if (c === "-" && i === 0) return true;
      if (c === "." && !decimal) {
        decimal = true;
        return true;
      }
      return c >= "0" && c <= "9";
    })
    .join("");
}

function to_number(value) {
  return Number(value)
}

let value = '-'
value = to_number_text(value)
console.log(value)

value += '2'
value = to_number_text(value)
console.log(value)

value += 'a'
value = to_number_text(value)
console.log(value)

value += '.'
value = to_number_text(value)
console.log(value)

value += '5'
value = to_number_text(value)
console.log(value)






await (async () => {
  const { create } = await import("rollo/component");
  const { Floating } = await import("rolloui/form/Floating");
  const { InvalidFeedback } = await import("rolloui/form/InvalidFeedback");
  const { TextInput } = await import("rolloui/form/input/TextInput");
  const { NumberInput } = await import("rolloui/form/input/NumberInput");
  const { Label } = await import("rolloui/form/Label");

  const form = create(
    "form.d-flex.flex-column.row-gap-3.p-3",
    { parent: root, noValidate: true },
    create(
      "SECTION",
      {},
      Label({ for_name: "my_number" }, "My number"),
      NumberInput({
        name: "my_number",
        required: true,
        min: 3,
        validations: [
          function () {
            if (this.value !== 42) {
              return "Not 42";
            }
          },
        ],
      }),
      InvalidFeedback({for_name: 'my_number'}),
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
