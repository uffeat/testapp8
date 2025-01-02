// value_match

/* Purpose: Demonstate and Value.match */
await (async () => {
  const { Value } = await import("rollo/type/types/value/value");
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data({
    foo: "foo",
  });

  const value = Value(42);
  

  /* Prepare test */
  let actual = "";

  
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
