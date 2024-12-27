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
  data.effects.add(function effect({ current }) {
    effect._count = effect._count || 0;
    ++effect._count;
    if (effect._count > 2) {
      console.error(
        `Effect ran more than twice. Filtering does not batch-update correctly!`
      );
    }
  });
  /* Change data */
  data.filter(([k, v]) => typeof v === "number");
  /* Check final result */
  const expected = { stuff: 42, thing: 7 };
  if (data.match(expected)) {
    console.log(`Success! Current data:`, data.current);
  } else {
    console.error(`Expected:`, expected, `Actual:`, data.current);
  }
})();