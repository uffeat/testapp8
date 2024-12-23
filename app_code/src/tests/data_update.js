// data_update

await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = type.create("data", {
    foo: "foo",
    bar: "bar",
    stuff: 42,
    thing: 42,
    name: "uffe",
  });
  data.update({ foo: "FOO", bar: "BAR" });
  // FIX!!!
  //data({ foo: "FOO", bar: "BAR" });

  /* Show accessor and data items */
  console.log("data:", data);
  /* Show data items */
  console.log("data.data:", data.data);
  /* Test single accessor item */
  console.log("name:", data.name);
})();
