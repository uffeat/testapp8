// data_update

await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
    thing: 42,
    name: "uffe",
  });

  data({ foo: "FOO", bar: "BAR" });
  console.log("data.data:", data.data);
})();
