/* Primary purpose: Test and demo of forEach.
Also features
- current
- effects
- match
*/
await (async () => {
  const { List } = await import("@/rollo/type/types/reactive/list/list");

  /* Test utils */
  const error = (expected, actual) =>
    console.error(`Expected:`, expected, `Actual:`, actual);
  const success = () => console.log("Success!");

  const values = [1, 2, 3];
  const state = List(values);

  /* Add effect to check that forEach does not trigger effects */
  state.effects.add(() =>
    console.error(`Effect should not have been triggered.`)
  );

  /* Run forEach */
  (() => {
    const expected = List([2, 4, 6]);
    const actual = [];
    state.forEach((v) => actual.push(2 * v));
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
  })();

  /* Check that forEach did not affect state */
  if (state.match(values)) {
    success();
  } else {
    error(values, state.current);
  }
})();
