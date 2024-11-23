// file_input

await (async () => {
  const { create } = await import("rollo/component");
  const { FileInput } = await import("rolloui/form/input/FileInput");

  const form = create(
    "form.d-flex.flex-column.row-gap-3.p-3",
    { parent: root, noValidate: true },
    FileInput({ label: "Foo", name: "foo", required: false }),
    FileInput({ label: "Bar", name: "bar", multiple: true, required: true }),
    FileInput({
      label: "Stuff",
      name: "stuff",
      floating: true,
      multiple: true,
      required: true,
    })
  );
})();