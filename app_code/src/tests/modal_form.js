// modal_form

await (async () => {
  const { create } = await import("rollo/component");
  const { close, modal } = await import("rolloui/modal");

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
        function () {
          this.noValidate = true;
          this.addEventListener("submit", (event) => {
            event.preventDefault();
            close(event.submitter?._value);
          });
        },
      ],
    },
    create(
      "button.btn.btn-primary",
      { type: "submit", disabled: true, _value: true },
      "OK"
    ),
    create("button.btn.btn-primary", { _value: null }, "Cancel")
  );

  console.log("Result:", result);
})();