// data_reduce

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/data/data");

  const data = type.create("data", {
    foo: "FOO",
    bar: "BAR",
    stuff: 42,
    thing: 42,
  });

  /* Get sum of all items with number values */
  const value = data.reduce(
    (data) => data.filter(([k, v]) => typeof v === "number"),
    (items) => items.values,
    (values) => {
      let sum = 0;
      values.forEach((v) => (sum += v));
      return sum;
    }
  );
  console.log("value:", value);
  console.log("data:", data);
})();
