// value_effects


/* Purpose: Demonstate and test Value.effects */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");
  const { Value } = await import("rollo/type/types/value/value");

  const value = Value.create();

  value.effects.add((change) => {
    console.log(`current:`, change.current);
    console.log(`previous:`, change.previous);
  });

  value.current = 42;
  value.update({ current: "FOO" });

  value.current = Data.create({
    a: 1,
    b: 2,
    c: 3,
  });

  value.current = Data.create({
    a: 1,
    b: 2,
    c: 3,
  });

  value.current = Data.create({
    a: 1,
    b: 2,
    c: 4,
  });

  console.log(`value.current:`, value.current);
  console.log(`value:`, value.data);
})();