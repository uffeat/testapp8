// value_subscriptions

/* Purpose: Demonstate and test Value.subscriptions */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");
  const { Value } = await import("rollo/type/types/value/value");
  

  const publisher = Data.create({
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

  foo.subscriptions.add(publisher, (change) => {
    let sum = 0;
    for (const v of Object.values(change.current)) {
      sum += v;
    }
    return sum;
  });

  console.log(`current:`, foo.current);
})();
