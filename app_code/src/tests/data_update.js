// data_update

/* Purpose: Demonstate and test 'update' */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
  });

  /* Set up effect to check batch-updates. */
  data.effects.add(function effect({ current }) {
    effect._count = effect._count || 0;
    ++effect._count;
    if (effect._count > 2) {
      console.error(
        `Effect ran more than twice; batch-update does not work correctly!`
      );
    }
  });

  /* Change data */
  data.update({ foo: "FOO", bar: "BAR", stuff: undefined });
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
