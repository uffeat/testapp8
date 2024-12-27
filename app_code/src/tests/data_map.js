// data_map

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/data/data");

  const data = type.create("data", {
    foo: "FOO",
    bar: "BAR",
    stuff: 42,
    thing: 42,
  });

  /* Double the value of all number items */
  data.map(([k, v]) => {
    if (typeof v === "number") {
      return [k, 2 * v];
    } else {
      return [k, v];
    }
  });

  console.log("data:", data);
})();

