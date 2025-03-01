/* Primary purpose: Test and demo intersection. 
Also features
- match */
await (async () => {
  const { Data } = await import("@/rollo/type/types/reactive/data/data");

  /* Test utils */
  const error = (expected, actual) =>
    console.error(`Expected:`, expected, `Actual:`, actual);
  const success = () => console.log("Success!");
  const test = (expected, actual) => {
    if (expected === actual) {
      success();
    } else {
      error(expected, actual);
    }
  };

  [
    [{ a: 1, b: 2 }, { d: 4 }],
    [{}, { d: 4 }],
    [{ a: 1, b: 2 }, {}],
  ].forEach(([expected, fragment]) => {
    const actual = Data({ a: 1, b: 2, c: 3 }).intersection({
      ...expected,
      ...fragment,
    });
    if (Data(expected).match(actual)) {
      success();
    } else {
      error(expected, actual);
    }
  });
})();
