/* Primary purpose: Test and demo of clear. 
Also features:
- match
- size
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
    { foo: 1, bar: 2 },
    { detail: { count: 0 } },
    (state) => {
      state.effects.add((change) => ++change.owner.detail.count);
      state.clear();
      test(1, state.detail.count);
      test(0, state.size);
    },
    (state) => {
      const expected = {};
      if (state.match(expected)) {
        success();
      } else {
        error(expected, state.current);
      }
    }
  );
})();