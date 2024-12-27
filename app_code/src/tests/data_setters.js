// data_setters

/* Purpose: Demonstate and test reactive getters */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
  });

  /* Check effect. */
  data.effects.add(function effect({ current }) {
    console.log(`current:`, current);
  });

  /* Change data */
  data.foo = 'FOO'
  data.bar = 'BAR'
  data.stuff = undefined
  
  /* Check final result */
  const expected = {
    foo: "FOO",
    bar: "BAR",
  };
  if (data.match(expected)) {
    console.log(`Success! Current data:`, data.current);
  } else {
    console.error(`Expected:`, expected, `Actual:`, data.current);
  }
})();