// check_input


await (async () => {
  const { create } = await import("rollo/component");
  const { CheckInput } = await import("rolloui/form/input/CheckInput");

  const form = create(
    "form.d-flex.flex-column.row-gap-3.p-3",
    { parent: root, noValidate: true },
    CheckInput({
      label: "Accept",
      name: "accept",
      required: true,
      toggle: true,
      value: true,
    }),
    CheckInput({ label: "Agree", name: "agree", required: false, value: true })
  );
  const check_input = CheckInput({ label: "Foo", name: "foo" })
  console.log(check_input.name)
  console.log(check_input.value)
})();