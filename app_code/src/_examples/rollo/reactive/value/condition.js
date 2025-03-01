/* Primary purpose: Test and demo condition. */
await (async () => {
  const { Value } = await import("@/rollo/type/types/reactive/value/value");

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

  const state = Value(null, {
    condition: (value) => typeof value === "number",
    effects: [(change) => {
      ////console.log("change:", change);////
      change.owner.detail.session = change.session
      if (typeof change.data.current !== "number") {
        console.error(`Effect should not have run!`);
      }
    }],
  });
  state.$ = 'foo';
  state.$ = 1;
  state.$ = 42;
  test(1, state.detail.session)
})();