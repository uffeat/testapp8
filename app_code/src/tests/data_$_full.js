// data_$_full

/* Purpose: Demonstate and test Data.$ */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
  });

  const state = Data.create({
    a: 1,
    b: 2,
    c: 3,
  });

  /* Set up effect to watch changes */
  data.effects.add((change) => {
    console.log(`current:`, change.current);
  });

  data.$ = state;

  state.$.a = 10;

  console.log(`data.data:`, data.data);
})();
