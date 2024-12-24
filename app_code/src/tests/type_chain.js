// type_chain

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/data/data");

  const data = type.create("data", {
    foo: "foo",
    bar: undefined,
  });

  const chain = data.__chain__;

  console.log("chain:", chain.chain);
  console.log("defined:", chain.defined);
  console.log("clean is defined:", chain.defined.has("clean"));
  console.log("foo is defined:", chain.defined.has("foo"));
  console.log("names:", chain.names);
  console.log(
    "A class with the name 'Data' is in the chain:",
    chain.names.has("Data")
  );
  console.log("size:", chain.size);
  chain.prototypes.clean.clean.call(data);
  console.log("After clean:", data.data);
})();