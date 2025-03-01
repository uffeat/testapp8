/* Primary purpose: Test and demo of condition. 
Also features:
- $
- values
*/
await (async () => {
  const { Data } = await import("@/rollo/type/types/reactive/data/data");

  /* Test utils */
  const error = () => console.error(`'condition' failed!`);
  const success = () => console.log("Success!");

  Data(
    null,
    {
      condition: (updates) => {
        for (const value of Object.values(updates)) {
          if (typeof value !== "number") {
            return false;
          }
        }
        return true;
      },
    },
    (state) => {
      state.$.foo = "FOO";
      state.$.stuff = 42;
      state.$.bar = 8;
    },
    (state) => {
      let failed = false;
      for (const value of state.values) {
        if (typeof value !== "number") {
          error();
          failed = true;
          break;
        }
      }
      if (!failed) {
        success();
      }
    }
  );
})();