/* Primary purpose: Test and demo of clear.
Also features
- detail
- match
- size
- change.session
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

  const state = List([1, 2, 3], {}, function () {
    this.effects.add((change) => {
      this.detail.session = change.session;
    });
  });

  test(3, state.size);
  /* Indirectly check that clear worked */
  test(0, state.clear().size);
  /* Check that clear triggered effect */
  test(0, state.detail.session);
  /* Directly check that clear worked */
  if (state.match([])) {
    success();
  } else {
    console.error(`'clear' failed!`);
  }
})();
