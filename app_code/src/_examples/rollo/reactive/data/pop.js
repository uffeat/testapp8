/* Primary purpose: Test and demo pop. 
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

  Data({ foo: "FOO", bar: "BAR" }, {}, (state) => {
    state.effects.add((change) => {
      change.effect._called = true;
    });
    test("BAR", state.pop("bar"));
    /* Check that pop changed state */
    const expected = { foo: "FOO" };
    if (state.match(expected)) {
      success();
    } else {
      error(expected, state.current);
    }
    /* Check that effect was called */
    test(true, state.effects.effects()[0]._called);
  });
})();