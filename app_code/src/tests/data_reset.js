// data_reset

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/data/data");

  const data = type.create("data", {
    foo: "FOO",
    bar: "BAR",
    stuff: 42,
    thing: 42,
  });

  /* Set all item values to true */
  data.reset(true);
  console.log("data:", data);
})();
