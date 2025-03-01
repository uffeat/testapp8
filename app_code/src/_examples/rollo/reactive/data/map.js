/* Primary purpose: Test and demo map. 
Also features
- match */
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

  /* Map with mutation */
  Data({ foo: "foo", bar: "bar" }, {}, (state) => {
    state.effects.add((change) => {
      change.effect._called = true;
    });
    state.map(([k, v]) => [k, v.toUpperCase()]);
    const expected = { foo: "FOO", bar: "BAR" };
    /* Check that mapping changed state */
    if (state.match(expected)) {
      success();
    } else {
      error(expected, state.current);
    }
    /* Check that effect was called */
    test(true, state.effects.effects()[0]._called);
  });

  /* Map without mutation */
  Data(null, {}, (state) => {
    const updates = { foo: "foo", bar: "bar" };
    state.update(updates);

    state.effects.add((change) => {
      change.effect._called = true;
    });
    const expected = { foo: "FOO", bar: "BAR" };
    const actual = state.map(([k, v]) => [k, v.toUpperCase()], false);
    /* Check that mapping result */
    if (Data(expected).match(actual)) {
      success();
    } else {
      error(expected, state.current);
    }
    /* Check that effect was not called */
    test(undefined, state.effects.effects()[0]._called);
    /* Check that map did not affect state */
    if (state.match(updates)) {
      success();
    } else {
      error(updates, state.current);
    }
  });
})();
