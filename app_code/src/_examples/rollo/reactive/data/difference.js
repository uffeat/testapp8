
/* Primary purpose: Test and demo of difference. 
Also features:
- match
*/
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

  Data(
    { a: 1, b: 2 },
    {},
    (state) => {
      const other = { a: 1, b: 20 };
      const actual = state.difference(other);
      const expected = { b: 2 };
      if (Data(expected).match(actual)) {
        success();
      } else {
        error(expected, actual);
      }
    },
    (state) => {
      const other = { a: 1, b: 20 };
      const actual = state.difference(other, true);
      const expected = { b: 20 };
      if (Data(expected).match(actual)) {
        success();
      } else {
        error(expected, actual);
      }
    },
    (state) => {
      const other = { a: 1, b: 20 };
      const actual = state.difference(other, null);
      const expected = [
        ["b", 2],
        ["b", 20],
      ];
      test(JSON.stringify(expected.sort()), JSON.stringify(actual.sort()));
    }
  );
})();