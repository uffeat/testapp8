/* Primary purpose: Test and demo of
- transformer prop
Also features
- add method
- remove method
- match method
- current prop
*/
await (async () => {
  const { List } = await import("@/rollo/type/types/reactive/list/list");

  /* Test utils */
  const error = (expected, actual) =>
    console.error(`Expected:`, expected, `Actual:`, actual);
  const success = () => console.log("Success!");
  

  const state = List();

  state.transformer = ({ add, remove }, { sender }) => {
    const _add = add.map((v) => 2 * v);
    const _remove = [];
    return { add: _add, remove: _remove };
  };

  state.add(1, 2);
  state.remove(2);

  const expected = List([2, 4]);
  const actual = state.current;
  if (expected.match(actual)) {
    success();
  } else {
    error(expected.current, actual);
  }

  ////console.log("state:", state); ////
})();