// value_subscriptions

/* Purpose: Demonstate and test Value.subscriptions */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");
  const { Value } = await import("rollo/type/types/value/value");

  const data = Data.create({
    a: 1,
    b: 2,
    c: 3,
  });

  const value = Value.create("foo");

  /* Set up effect to watch changes */
  value.effects.add((change) => {
    console.log(`current:`, change.current);
    console.log(`previous:`, change.previous);
  });

  /* Let value subscribe to data.  */
  /* NOTE
  - Same as `value.subscriptions.add`
  */
  value.subscribe(data, function (change) {
    let sum = 0;
    for (const v of Object.values(change.current)) {
      sum += v;
    }
    this.current = sum;
  });

  data.$.a = 10;

  console.log(`current:`, value.current);
})();