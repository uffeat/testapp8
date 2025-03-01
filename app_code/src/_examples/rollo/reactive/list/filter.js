/* Primary purpose: Test and demo of filter, with and without mutation.
Also features
- detail
- match
- change.session
- range util
*/
await (async () => {
  const { List } = await import("@/rollo/type/types/reactive/list/list");
  const { range } = await import("@/rollo/tools/range");

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

  const state = List(range(1, 11), { detail: { session: null } });

  state.effects.add((change) => {
    ////console.log("change:", change); ////
    change.owner.detail.session = change.session;
  });

  /* Filter with mutation */
  state.filter((v) => v % 2 === 0);

  /* Filter without mutation */
  (() => {
    const expected = List([4, 8]);
    const actual = state.filter((v) => v % 4 === 0, false);
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
  })();

  /* Check that effect was triggered by filtering with mutation, 
  but not by filtering without mutation */
  test(0, state.detail.session);

  /* Check that state changed from filtering with mutation, 
  but not from filtering without mutation */
  (() => {
    const expected = List([2, 4, 6, 8, 10]);
    const actual = state.current;
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
  })();

  ////console.log("state:", state);////
})();
