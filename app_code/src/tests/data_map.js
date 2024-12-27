// data_map

/* Purpose: Demonstate and test Data.map */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
    thing: 7,
  });

  /* Set up effect to check that map batch-updates. */
  data.effects.add(function effect({ current }) {
    effect._count = effect._count || 0;
    ++effect._count;
    if (effect._count > 2) {
      console.error(
        `Effect ran more than twice; map does not batch-update correctly!`
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
    console.log(`Success! Current data:`, data.current);
  } else {
    console.error(`Expected:`, expected, `Actual:`, data.current);
  }
})();

