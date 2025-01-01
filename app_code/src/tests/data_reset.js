// data_reset

/* Purpose: Demonstate and test Data.reset */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data({
    foo: "foo",
    bar: "bar",
  });

  /* Set up effect to check that reset batch-updates. */
  data.effects.add(function effect({ session }) {
    if (session > 1) {
      console.error(
        `Effect ran ${session + 1} times; batch-update does not work correctly!`
      );
    }
  });
  /* Change data */
  data.reset(true);
  /* Check final result */
  const expected = {
    foo: true,
    bar: true,
  };
  if (data.match(expected)) {
    console.log(`Success! Current data:`, data.data);
  } else {
    console.error(`Expected:`, expected, `Actual:`, data.data);
  }
})();
