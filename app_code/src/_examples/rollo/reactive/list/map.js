/* Primary purpose: Test and demo of map.  
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

  const state = List([2, 3]);

  state.effects.add((change) => {
    ////console.log("change:", change); ////
    change.owner.detail.session = change.session;
  });

  /* Map with mutation */
  state.map((v) => 2*v);

  /* Map without mutation */
  (() => {
    const expected = List([8, 12]);
    const actual = state.map((v) => 2*v, false);
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
  })();

  /* Check that effect was triggered by mapping with mutation, 
  but not by filtering without mutation */
  test(0, state.detail.session);

  /* Check that state changed from mapping with mutation, 
  but not from filtering without mutation */
  (() => {
    const expected = List([4, 6]);
    const actual = state.current;
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
  })();

  ////console.log("state:", state);////
})();