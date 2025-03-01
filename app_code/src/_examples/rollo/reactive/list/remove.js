/* Primary purpose: Test and demo of remove, removed and remove-type effect.
Also features
- match
- self-removing effects
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

  const values = [2, 3];
  const state = List([1, 2, 3]);

  const effects = (change) => {
    ///console.log("change:", change); ////
    change.owner.detail.session = change.session;
    const expected = List(values);
    const actual = change.data.removed;
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
    /* Let effect remove itself; convenient, when testing */
    change.owner.effects.remove(change.effect, change.type);
  };

  /* Check remove effect */
  state.effects.add(effects, "remove");

  state.remove(...values);

  /* Check that effect ran */
  test(0, state.detail.session);

  (() => {
    const expected = List(values);
    const actual = state.removed;
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
  })();

  state.effects.add(effects, "remove", true);
  /* Check that effect ran */
  test(null, state.detail.session);
})();
