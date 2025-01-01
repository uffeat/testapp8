// data_map

/* Purpose: Demonstate and test Data.map */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data({
    foo: "foo",
    bar: "bar",
    stuff: 42,
    thing: 7,
  });

  /* Set up effect to check that map batch-updates. */
  data.effects.add(function effect({ session }) {
    if (session > 1) {
      console.error(
        `Effect ran ${session + 1} times; batch-update does not work correctly!`
      );
    }
  });
  /* Change data */
  data.map(([k, v]) => {
    if (typeof v === "number") {
      return [k, 2 * v];
    } else {
      return [k, v];
    }
  });
  /* Check final result */
  const expected = {
    foo: "foo",
    bar: "bar",
    stuff: 84,
    thing: 14,
  };
  if (data.match(expected)) {
    console.log(`Success! Data:`, data.data);
  } else {
    console.error(`Expected:`, expected, `Actual:`, data.data);
  }
})();

