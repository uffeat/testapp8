/* Primary purpose: Test and demo of update.
Also features
- current
- detail
- match 
- change.sender
- change.session
*/
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

  const state = List(null);

  state.effects.add((change) => {
    change.owner.detail.session = change.session;
    change.owner.detail.sender = change.sender;
  });

  const sender = class Sender {};

  state.update({ add: [1, 2, 3], sender });

  (() => {
    const expected = List([1, 2, 3]);
    const actual = state.current;
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
  })();

  state.update({ add: [4, 5], remove: [1, 2], sender });

  (() => {
    const expected = List([3, 4, 5]);
    const actual = state.current;
    if (expected.match(actual)) {
      success();
    } else {
      error(expected.current, actual);
    }
  })();

  test(1, state.detail.session);
  test(sender, state.detail.sender);
})();
