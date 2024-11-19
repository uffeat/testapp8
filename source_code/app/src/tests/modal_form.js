// modal_form


import { create } from "component/component";
import { close, modal } from "utils/modal";

const result = await modal(
  {
    tag: "form",
    title: "Enter secret agent number",
    content: create("input.form-control", {
      placeholder: "00...",
      on_input: function (event) {
        this.closest("form").querySelector('button[type="submit"]').disabled =
          this.value !== "007";
      },
    }),
    dismissible: false,
    size: "lg",
    hooks: [
      function (fragment) {
        this.noValidate = true;
        this.on.submit = (event) => {
          event.preventDefault();
          close(event.submitter?._value);
        };
      },
    ],
  },
  create(
    "button.btn.btn-primary",
    { type: "submit", disabled: true, _value: true },
    "OK"
  ),
  create("button.btn.btn-primary", {}, "Cancel")
);

console.log("Modal result:", result);
