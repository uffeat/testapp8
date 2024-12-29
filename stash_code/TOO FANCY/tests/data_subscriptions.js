// data_subscriptions

/* Purpose: Demonstate and test Data.subscriptions/bind */
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

  data.bind(state)

  state.$.a = 10;
  state.$.foo = 'foo'

  console.log(`data.data:`, data.data);
})();