// data_clone

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/data/data");

  const data = type.create("data", {
    foo: "FOO",
    bar: "BAR",
  });

  const data_clone = data.clone();
  data.foo = "foo in data";
  data_clone.foo = "foo in clone";

  console.log("data:", data);
  console.log("data_clone:", data_clone);
})();
