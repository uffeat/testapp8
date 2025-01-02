// value_type

/* Purpose: Demonstate and Value.type */
await (async () => {
  const { Value } = await import("rollo/type/types/value/value");
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data({
    foo: "foo",
  });

  /* Prepare test */
  let actual = "";

  const value = Value(42);
  

  

  
  /* Verify */
  (() => {
    const expected = "42";
    const message = `Expected ${expected}. Actual: ${actual}`;
    if (actual === expected) {
      console.log(`Success! ${message}`);
    } else {
      //console.error(message);
    }
  })();
})();
