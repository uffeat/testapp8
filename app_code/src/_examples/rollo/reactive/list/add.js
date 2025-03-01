/* Primary purpose: Test and demo of add, added, and add-type effect.
Also features
- current
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

  const state = List([1, 2, 3]);

  /* Check add effect */
  state.effects.add((change) => {
    ///console.log("change:", change); ////
    const expected = List([4, 5]);
    const actual = change.data.added;
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
    /* Let effect remove itself; convenient, when testing */
    change.owner.effects.remove(change.effect, change.type);
  }, "add");

  state.add(3, 4, 5);

  /* Check add effect, immediately run */
  state.effects.add(
    (change) => {
      ////console.log("change:", change); ////
      /* NOTE
      - When effect is run the first time, current is used for change.data.added
      */
      const expected = List([1, 2, 3, 4, 5]);
      const actual = change.data.added;
      if (expected.match(actual)) {
        success();
      } else {
        error(expected.current, actual);
      }

      /* Let effect remove itself; convenient, when testing */
      change.owner.effects.remove(change.effect, change.type);
    },
    "add",
    { run: true }
  );

  /* Check added */
  (() => {
    const expected = List([1, 2, 3, 4, 5]);
    const actual = state.current;
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
  })();

  /* Check current */
  (() => {
    const expected = List([4, 5]);
    const actual = state.added;
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
  })();

  ////console.log('state:', state);////
})();