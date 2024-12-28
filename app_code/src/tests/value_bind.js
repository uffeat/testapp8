// value_bind

/* Purpose: Demonstate and test Value.bind */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");
  const { Value } = await import("rollo/type/types/value/value");

  const state = Data.create({
    a: 1,
    b: 2,
    c: 3,
  });

  const foo = Value.create("foo");

  /*  */
  foo.effects.add((change) => {
    console.log(`current:`, change.current);
    console.log(`previous:`, change.previous);
  });

  foo.reducer = (change) => {
    let sum = 0;
    for (const v of Object.values(change.current)) {
      sum += v;
    }
    return sum;
  };

  foo.bind(state);

  state.$.a = 10;
})();
