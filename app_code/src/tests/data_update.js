// data_update

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/data/data");

  const data = type.create("data", {
    foo: "foo",
    bar: "bar",
    stuff: 42,
    thing: 42,

    name: 'uffe'
  });

  data.update({ foo: "FOO", bar: "BAR" });
  console.log("data:", data);

  console.log("name:", data.name);


  console.log("name in data:", 'name' in data);

  console.log("update in data:", 'update' in data);
})();
