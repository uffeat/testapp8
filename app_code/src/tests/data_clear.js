// data_clear

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/data/data");

  const data = type.create("data", {
    foo: "foo",
    bar: "bar",
    stuff: 42,
    thing: 42,
  });

  console.log("Before clear:", data.data);
  /* Delete all items */
  data.clear();
  console.log("After clear:", data.data);
})();
