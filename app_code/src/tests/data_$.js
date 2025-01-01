// data_$

/* Purpose: Demonstate and test Data.$ */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data({
    foo: "foo",
  });

  /* Set up effect to watch changes */
  data.effects.add((change) => {
    console.log(`current:`, change.current);
  });

  data.$.foo = 42;
  data.$.foo = 42;
  data.$.foo = undefined;

  console.log("data.data:", data.data);
})();
