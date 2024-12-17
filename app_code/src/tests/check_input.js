// check_input

await (async () => {
  const { create } = await import("rollo/component");
  const { CheckInput } = await import("rolloui/form/input/CheckInput");

  create("div", {
    id: "root",
    parent: document.body,
  });

  create(
    "form.d-flex.flex-column.row-gap-3.p-3",
    { parent: root, noValidate: true },
    CheckInput({
      label: "Accept",
      name: "accept",
      required: true,
      toggle: true,
      value: true,
    }),
    CheckInput({ label: "Agree", name: "agree", required: true, value: true })
  );
})();
