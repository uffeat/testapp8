// data_update

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/data/data");
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
    thing: 42,
  });

  data.on_change = ({ current, previous, owner }) => {
    console.log(`'previous' from on_change:`, previous);
    console.log(`'current' from on_change:`, current);
  };

  data.foo = "changed foo";
  data({ foo: "changed foo again" });
  data({ foo: "FOO", bar: "BAR" });

  console.log("data.data:", data.data);
})();
