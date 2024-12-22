// data_update

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/data/data");

  const data = type.create("data", {
    __condition__: (update) => {
      const filtered = {};
    },

    foo: "foo",
    bar: "bar",
    stuff: 42,
    thing: 42,
  });

  data.update({ foo: "FOO", bar: "BAR" });
  console.log("data:", data);
})();
