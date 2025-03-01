/* Primary purpose: Test and demo reset. 
Also features
- match
- update */
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

  /* Mutating */
  Data({ a: 1, b: 2 }, {}, (state) => {
    const effect = (change) => {
      ////console.log("change:", change);////
      change.effect._ran = true;
      change.owner.effects.remove(change.effect);
    };
    state.effects.add(effect);
    state.reset();
    const expected = {};
    const actual = state.current;
    if (Data(expected).match(actual)) {
      success();
    } else {
      error(expected, actual);
    }
    test(true, effect._ran);
  });
  Data({ a: 1, b: 2 }, {}, (state) => {
    const effect = (change) => {
      ////console.log("change:", change);////
      change.effect._ran = true;
      change.owner.effects.remove(change.effect);
    };
    state.effects.add(effect);
    state.reset(true);
    const expected = { a: true, b: true };
    const actual = state.current;
    if (Data(expected).match(actual)) {
      success();
    } else {
      error(expected, actual);
    }
    test(true, effect._ran);
  });

  /* Non-mutating */
  Data(null, {}, (state) => {
    const original = { a: 1, b: 2 };
    state.update(original);
    const effect = (change) => {
      ////console.log("change:", change);////
      change.effect._ran = true;
      change.owner.effects.remove(change.effect);
    };
    state.effects.add(effect);
    const actual = state.reset(true, false);
    const expected = { a: true, b: true };
    if (Data(expected).match(actual)) {
      success();
    } else {
      error(expected, actual);
    }
    test(undefined, effect._ran);
    if (state.match(original)) {
      success();
    } else {
      error(original, state.current);
    }
  });
})();
