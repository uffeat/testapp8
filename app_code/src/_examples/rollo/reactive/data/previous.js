/* Primary purpose: Test and demo previous. 
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

  Data(null, {}, (state) => {
    [
      [{ a: 1, b: 2 }, {}],
      [{ b: undefined }, { a: 1, b: 2 }],
      [{ c: 3 }, { a: 1 }],
    ].forEach(([updates, expected]) => {
      state.update(updates);
      const actual = state.previous;
      if (Data(expected).match(actual)) {
        success();
      } else {
        error(expected, actual);
      }
    });
  });
})();