/* Primary purpose: Test and demo of match.  
Also features
- clear
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

  const state = List([1, 2, 3]);

  (() => {
    if (state.match([1, 2, 3])) {
      success();
    } else {
      console.error(`'match' failed.`);
    }
  })();

  (() => {
    if (state.match(List([1, 2, 3]))) {
      success();
    } else {
      console.error(`'match' failed.`);
    }
  })();

  (() => {
    if (state.match([1, 2])) {
      console.error(`'match' failed.`);
    } else {
      success();
    }
  })();

  state.clear();

  (() => {
    if (state.match([])) {
      success();
    } else {
      console.error(`'match' failed.`);
    }
  })();
})();
