// data_filter

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/data/data");

  const data = type.create("data", {
    foo: "FOO",
    bar: "BAR",
    stuff: 42,
    thing: 42,
  });

  /* Delete all items with number values */
  data.filter(([k, v]) => typeof v !== "number");
  console.log("data:", data);
})();
