// data_update

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/data/data");

  const data = type.create("data", {
    foo: "foo",
    bar: "barr",
    stuff: 42,
    thing: 42,
  });


  console.log("data:", data);

  
})();
