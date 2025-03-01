/* Primary purpose: Test and demo update. 
Also features
- effects
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

  Data(null, {}, (state) => {
    const SENDER = {};
    const effect = (change) => {
      ////console.log("change:", change); ////
      change.effect._count =
        change.effect._count === undefined ? 1 : ++change.effect._count;
      test(SENDER, change.sender);
    };

    state.effects.add(effect);

    state.update({ a: 1 }, { sender: SENDER });
    state.update({ b: 2 }, { silent: true });
    test(1, effect._count);
  });
})();