// modal_custom


await (async () => {
  const { create } = await import("rollo/component");
  const { close, modal } = await import("rolloui/modal");

  const result = await modal({
    content: create(
      "FORM.d-flex.flex-column.row-gap-3.pt-2",
      {
        noValidate: true,
        on_submit: function (event) {
          event.preventDefault();
          //close(event.submitter?._value); // Also works
          this.closest(".modal").dispatchEvent(
            new CustomEvent("close", { detail: event.submitter?._value })
          );
        },
      },
      create("H1", {}, "Enter secret agent number"),
      create("INPUT.form-control", {
        placeholder: "00...",
        on_input: function (event) {
          this.closest("form").querySelector('button[type="submit"]').disabled =
            this.value !== "007";
        },
      }),
      create(
        "MENU.d-flex.justify-content-end.column-gap-3.px-2.pt-2.m-0",
        {},
        create(
          "BUTTON.btn.btn-primary",
          { type: "submit", disabled: true, _value: true },
          "OK"
        ),
        create("BUTTON.btn.btn-primary", { _value: null }, "Cancel")
      )
    ),
    dismissible: false,
    size: "lg",
  });

  console.log("Result:", result);
})();