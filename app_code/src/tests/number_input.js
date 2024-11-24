// number_input

await (async () => {
  const { create } = await import("rollo/component");
  const { InvalidFeedback } = await import("rolloui/form/InvalidFeedback");
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