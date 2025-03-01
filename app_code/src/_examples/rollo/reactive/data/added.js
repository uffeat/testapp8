/* Primary purpose: Test and demo added and add-type effect. 
Also features:
- match
- update
*/
await (async () => {
  const { Data } = await import("@/rollo/type/types/reactive/data/data");

  /* Test utils */
  const error = (expected, actual) =>
    console.error(`Expected:`, expected, `Actual:`, actual);
  const success = () => console.log("Success!");

  /* 'added' prop */
  Data(
    null,
    {},
    (state) => {
      const updates = { foo: "FOO", bar: "BAR" };
      state.update(updates);
      if (Data(state.added).match(updates)) {
        success();
      } else {
        error(updates, state.added);
      }
    },
    (state) => {
      state.update({ foo: "FOO", stuff: 42 });
      const expected = { stuff: 42 };
      const actual = state.added;
      if (Data(expected).match(actual)) {
        success();
      } else {
        error(expected, actual);
      }
    },
    (state) => {
      state.update({ stuff: undefined });
      const expected = {};
      const actual = state.added;
      if (Data(expected).match(actual)) {
        success();
      } else {
        error(expected, actual);
      }
    }
  );

  /* 'add'-type effect */
  Data(null, {}, (state) => {
    const updates = { foo: "FOO", bar: "BAR" };
    state.effects.add((change) => {
      ////console.log("change:", change);////
      if (change.session === 0) {
        const expected = updates;
        const actual = change.data.added;
        if (Data(expected).match(actual)) {
          success();
        } else {
          error(expected, actual);
        }
      } else if (change.session === 1) {
        const expected = { stuff: 42 };
        const actual = change.data.added;
        if (Data(expected).match(actual)) {
          success();
        } else {
          error(expected, actual);
        }
      }
    }, "add");
    state.update(updates);
    state.update({ foo: "FOO", stuff: 42 });
  });

  /* 'add'-type effect, immediately run */
  Data(null, {}, (state) => {
    const updates = { foo: "FOO", bar: "BAR" };
    state.update(updates);
    state.effects.add(
      (change) => {
        ////console.log("change:", change);////
        if (Data(state.added).match(updates)) {
          success();
        } else {
          error(updates, state.added);
        }
      },
      "add",
      { run: true }
    );
  });
})();