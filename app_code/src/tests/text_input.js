await (async () => {
  const { create } = await import("rollo/component");
  const { ErrorFeedback } = await import("rolloui/form/ErrorFeedback");
  const { TextInput } = await import("rolloui/form/input/TextInput");
  const { Label } = await import("rolloui/form/Label");
  const { Floating } = await import("rolloui/form/Floating");

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
      ErrorFeedback({ for_name: "my_name" })
    ),
    Floating(
      { label: "Foo" },
      TextInput({ name: "foo", required: true }),
      ErrorFeedback({ for_name: "foo" })
    ),
    create(
      "DIV.input-group",
      {},
      create("SPAN.input-group-text", {}, "@"),
      Floating(
        { label: "Bar" },
        TextInput({ name: "bar", required: true, ["css_rounded-end"]: true })
      ),
      ErrorFeedback({ for_name: "bar" })
    ),
    Floating(
      { label: "Stuff" },
      TextInput({ name: "stuff", required: true, type: "textarea" }),
      ErrorFeedback({ for_name: "stuff" })
    )
  );
})();