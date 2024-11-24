// text_input

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
      InvalidFeedback({ for_name: "my_name" })
    ),
    Floating(
      { label: "Foo" },
      TextInput({ name: "foo", required: true }),
      InvalidFeedback(),
      /* Connect invalid feedback to input; alternative to using for_name */
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
        { label: "My email" },
        TextInput({
          name: "my_email",
          type: "email",
          required: true,
          ["css_rounded-end"]: true,
        })
      ),
      InvalidFeedback({ for_name: "my_email" })
    )
  );
})();
