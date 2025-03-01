/* Primary purpose: Test and demo match. */
await (async () => {
  const { Data } = await import("@/rollo/type/types/reactive/data/data");

  /* Test utils */
  const success = () => console.log("Success!");
  const error = () => console.error(`'match' failed!`);

  Data(null, {}, (state) => {
    const updates = { foo: "FOO", bar: "BAR" };
    state.update(updates);
    [updates, Data(updates)].forEach((other) =>
      state.match(other) ? success() : error()
    );
    [
      { foo: "FOO" },
      { foo: "foo", bar: "BAR" },
      { FOO: "FOO", bar: "BAR" },
      ["FOO", "BAR"],
      "FOO",
    ].forEach((other) => (state.match(other) ? error() : success()));
  });
})();
