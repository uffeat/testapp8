// data_$_single

/* Purpose: Demonstate and test Data.$ */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");
  const { Value } = await import("rollo/type/types/value/value");

  const data = Data.create({
    foo: "foo",
  });

  /* Set up effect to watch changes */
  data.effects.add((change) => {
    console.log(`current:`, change.current);
  });

  data.$.foo = undefined;

  const value = Value.create(42);

  data.$.foo = value;

  value.current = "FOO";
})();
