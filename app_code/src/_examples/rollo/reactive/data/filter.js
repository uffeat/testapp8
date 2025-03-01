/* Primary purpose: Test and demo of filter. 
Also features
- effects
- match
- update
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

  /* Filter with mutation */
  Data({ foo: "FOO", stuff: 42 }, {}, (state) => {
    state.effects.add((change) => {
      change.effect._called = true;
    });
    state.filter(([k, v]) => typeof v === "number");
    const expected = { stuff: 42 };
    /* Check that filtering changed current */
    if (state.match(expected)) {
      success();
    } else {
      error(expected, state.current);
    }
    /* Check that effect was called */
    test(true, state.effects.effects()[0]._called);
  });

  /* Filter without mutation */
  Data(null, {}, (state) => {
    const updates = { foo: "FOO", stuff: 42 };
    state.update(updates);

    state.effects.add((change) => {
      change.effect._called = true;
    });
    const expected = { stuff: 42 };
    const actual = state.filter(([k, v]) => typeof v === "number", false);
    /* Check filtered result */
    if (Data(expected).match(actual)) {
      success();
    } else {
      error(expected, actual);
    }
    /* Check that filtering did not change current */
    if (state.match(updates)) {
      success();
    } else {
      error(updates, state.current);
    }
    /* Check that effect was not called */
    test(undefined, state.effects.effects()[0]._called);
  });
})();