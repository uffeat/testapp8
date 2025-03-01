
/* Primary purpose: Test and demo match. */
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

  const state = Value();
  state.match = function (other) {
    if (typeof other === "string" && other.toLowerCase() === this.current) {
      return true;
    }
    return false;
  };

  const VALUE = "foo";
  state.$ = VALUE;

  state.effects.add(() => console.error(`Effect should not have run!`));

  state.$ = "FOO";
  test(VALUE, state.$);
})();