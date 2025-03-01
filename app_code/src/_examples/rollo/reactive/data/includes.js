/* Primary purpose: Test and demo includes. */
await (async () => {
  const { Data } = await import("@/rollo/type/types/reactive/data/data");

  /* Test utils */
  const success = () => console.log("Success!");
  const error = () => console.error(`'includes' failed!`);

  const state = Data({ a: 1, b: 2, c: 3 });

  if (state.includes({ a: 1, b: 2 })) {
    success();
  } else {
    error();
  }

  if (state.includes({ a: 10, b: 2 })) {
    error();
  } else {
    success();
  }
})();