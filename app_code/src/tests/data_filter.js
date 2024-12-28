// data_filter

/* Purpose: Demonstate and test Data.filter */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
    thing: 7,
  });

  /* Set up effect to check that filtering batch-updates. */
  data.effects.add(function effect({ session }) {
    if (session > 1) {
      console.error(
        `Effect ran ${session + 1} times; batch-update does not work correctly!`
      );
    }
  });
  /* Change data */
  data.filter(([k, v]) => typeof v === "number");
  /* Check final result */
  const expected = { stuff: 42, thing: 7 };
  if (data.match(expected)) {
    console.log(`Success! Data:`, data.data);
  } else {
    console.error(`Expected:`, expected, `Actual:`, data.data);
  }
})();