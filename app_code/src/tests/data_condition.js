// data_condition

await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
  });

  data.effects.add((data) => {
    console.log(`'previous' from effect:`, data.previous);
    console.log(`'current' from effect:`, data.current);
  });

  data.current = { name: "uffe", foo: "foo" };

  console.log(`data.current:`, data.current);
  console.log(`data.previous:`, data.previous);
})();
