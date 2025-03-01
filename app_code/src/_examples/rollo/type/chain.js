
/* Purpose: Demonstrate and test __chain__ */
await (async () => {
  const { Data } = await import("@/rollo/type/types/data/data");

  const data = Data({
    foo: "foo",
  });

  /* Verify that chain.defined includes accessor props */
  if (data.__chain__.defined.has("clear")) {
    console.log(`Success!`);
  } else {
    console.error(`__chain__.defined.has does not work!`);
  }

  /* Verify that chain.defined does not include data props */
  if (!data.__chain__.defined.has("foo")) {
    console.log(`Success!`);
  } else {
    console.error(`__chain__.defined.has does not work!`);
  }

  /* Verify that chain.prototypes can be used to retrieve a specific method 
  (unbound) from specific class */
  data.__chain__.prototypes.clear.clear.call(data);
  if (data.size) {
    console.error(`__chain__.prototypes does not work!`);
  } else {
    console.log(`Success!`);
  }
})();

