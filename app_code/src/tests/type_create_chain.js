// type_create_chain

await (async () => {
  const { type } = await import("rollo/type/type");
  const { create_chain } = await import("rollo/type/tools/create_chain");
  await import("rollo/type/types/data/data");

  const data = type.create("data", {
    foo: "foo",
    bar: undefined,
  });

  console.log("Chain:", create_chain(data));
})();