// data_clean

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/data/data");

  const data = type.create("data", {
    foo: "foo",
    bar: "bar",
    stuff: undefined,
    thing: undefined,
  });

  console.log("Before clean:", data.data);
  /* Delete all items with undefined values */
  data.clean();
  console.log("After clean:", data.data);
})();
