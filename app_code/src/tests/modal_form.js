// modal_form

await (async () => {
  const { create } = await import("rollo/component");
  const { close, modal } = await import("rolloui/modal");

  const result = await modal(
    {
      tag: "FORM",
      title: "Enter secret agent number",
      content: create("INPUT.form-control", {
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
      "BUTTON.btn.btn-primary",
      { type: "submit", disabled: true, _value: true },
      "OK"
    ),
    create("BUTTON.btn.btn-primary", { _value: null }, "Cancel")
  );

  console.log("Result:", result);
})();