/* Primary purpose: Test and demo of difference.
Also features
- match
*/
await (async () => {
  const { List } = await import("@/rollo/type/types/reactive/list/list");

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

  /* One-sided differences */
  (() => {
    const state = List([1, 2, 3]);
    test(3, state.difference([1, 2])[0]);
    // Alternatively:
    //test(3, state.difference([1, 2], false)[0]);

    test(4, state.difference([1, 2, 3, 4], true)[0]);
    // Alternatively:
    //test(4, state.difference([1, 2, 3, 4], "other")[0]);
  })();

  /* Symmetric difference */
  (() => {
    const actual = List([1, 2]).difference([2, 3], null);
    // Alternatively:
    //const actual = List([1, 2]).difference([2, 3], "symmetric");

    const expected = List([1, 3]);
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
  })();
})();
