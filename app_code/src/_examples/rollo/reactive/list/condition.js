/* Primary purpose: Test and demo of condition.
Also features
- add
- has
*/
await (async () => {
  const { List } = await import("@/rollo/type/types/reactive/list/list");

  /* Test utils */
  const success = () => console.log("Success!");

  const state = List([1, 2]);
  const unwanted = 3;
  state.condition = ({ add, remove }) => !add.includes(unwanted);
  state.add(3);
  state.add(4);

  if (state.has(unwanted)) {
    console.error(`Should not include:`, unwanted);
  } else {
    success();
  }

  ////console.log("state:", state); ////
})();
