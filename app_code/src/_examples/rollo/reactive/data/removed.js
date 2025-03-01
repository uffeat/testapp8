/* Primary purpose: Test and demo removed and remove-type effect. 
Also features
- pop
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

  /* Test constants */
  const DATA = Object.freeze({ a: 1, b: 2 });
  const B = "b";
  const EFFECT = (change) => {
    ////console.log("change:", change);////
    change.effect._ran = true;
    const expected = [B];
    const actual = change.data.removed;
    if (JSON.stringify(expected) === JSON.stringify(actual)) {
      success();
    } else {
      error(expected, actual);
    }
    change.owner.effects.remove(change.effect, "remove");
  };

  /* 'removed' prop */
  Data(
    DATA,
    {},
    (state) => {
      const expected = [];
      const actual = state.removed;
      if (JSON.stringify(expected) === JSON.stringify(actual)) {
        success();
      } else {
        error(expected, actual);
      }
    },
    (state) => {
      state.pop(B);
      const expected = [B];
      const actual = state.removed;
      if (JSON.stringify(expected) === JSON.stringify(actual)) {
        success();
      } else {
        error(expected, actual);
      }
    },
    (state) => {
      state.update({ b: 2, c: 3 });
      state.update({ b: undefined, c: undefined });
      const expected = ["b", "c"];
      const actual = [...state.removed].sort();
      if (JSON.stringify(expected) === JSON.stringify(actual)) {
        success();
      } else {
        error(expected, actual);
      }
    }
  );

  /* 'remove'-type effect */
  Data(DATA, {}, (state) => {
    state.effects.add(EFFECT, "remove");
    state.pop(B);
    test(true, EFFECT._ran);
    EFFECT._ran = null;
  });

  /* 'remove'-type effect, immediately run */
  Data(DATA, {}, (state) => {
    state.pop(B);
    state.effects.add(EFFECT, "remove", true);
    test(true, EFFECT._ran);
    EFFECT._ran = null;
  });
})();
