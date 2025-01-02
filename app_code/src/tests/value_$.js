// value_$

/* Purpose: Demonstate and Value.$ */
await (async () => {
  const { Value } = await import("rollo/type/types/value/value");

  const value = Value(42);

  let actual = "";

  value.effects.add(({ data: { current } }) => {
    console.log("current:", current);
    result += String(current);
  });

  value.$ = "foo";

  /* Test */

  (() => {
    const expected = "42foo";
    const message = `Expected ${expected}. Actual: ${actual}`;
    if (actual === expected) {
      console.log(`Success! ${message}`);
    } else {
      console.error(message);
    }
  })();
})();
