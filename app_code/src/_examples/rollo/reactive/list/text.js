/* Primary purpose: Test and demo of text. */
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

  const state = List([false, 3, undefined, 2, true, 1, null, "a"]);

  /* Sorted text */
  test(`["a",1,2,3,false,null,true,undefined]`, state.text(true));
  /* Unsorted text */
  (() => {
    const expected = `[false,3,undefined,2,true,1,null,"a"]`;
    test(expected, state.text());
    test(expected, String(state));
  })();

  /* Limited alternative to using unsorted text */
  (() => {
    const expected = `[false,3,2,true,1,"a"]`;
    const actual = JSON.stringify(
      state.filter(
        (v) => ["boolean", "number", "string"].includes(typeof v),
        false
      )
    );
    test(expected, actual);
  })();

  /* Limited alternative to using sorted text */
  (() => {
    const expected = `[1,2,3,"a",false,true]`;

    const actual = JSON.stringify(
      state
        .filter(
          (v) => ["boolean", "number", "string"].includes(typeof v),
          false
        )
        .sort()
    );
    test(expected, actual);
  })();
})();