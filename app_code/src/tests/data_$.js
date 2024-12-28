// data_$


/* Purpose: Demonstate and test Data.$ */
await (async () => {
 
  const { Data } = await import("rollo/type/types/data/data");
  const { Value } = await import("rollo/type/types/value/value");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
    thing: 7,
    __name__: "uffe",
  });

  /*  */
  data.effects.add((change) => {
    console.log(`current:`, change.current);
  });

  const state = Data.create({
    a: 1,
    b: 2,
    c: 3,
  });

  
  data.$.foo = 42;
 

  const foo = Value.create("foo");
  console.log(`current:`, foo.current);

  /*  */
  foo.effects.add((change) => {
    console.log(`current:`, change.current);
    console.log(`previous:`, change.previous);
  });

  foo.current = "FOO";

  foo.subscriptions.add(state, (change) => {
    let sum = 0;
    for (const v of Object.values(change.current)) {
      sum += v;
    }
    return sum;
  });

  
})();