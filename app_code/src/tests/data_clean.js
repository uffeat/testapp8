// data_clean

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/data/data");

  const data = type.create("data", {
    foo: "FOO",
    bar: "BAR",
    stuff: undefined,
    thing: undefined,
  });

  /* Delete all items with undefined values */
  data.clean();
  console.log("data:", data);
})();
