// data_update

/* Purpose: Demonstate and test 'update' */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data({
    foo: "foo",
    bar: "bar",
    stuff: 42,
  });

  /* Set up effect to check batch-updates. */
  data.effects.add((change) => {
    ////console.log("change:", change); ////
    const session = change.session || 0;
    if (session > 1) {
      console.error(
        `Effect ran ${session + 1} times; batch-update does not work correctly!`
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
    console.log(`Success!`);
  } else {
    console.error(`Expected:`, expected, `Actual:`, data.current);
  }

  //console.log("data.current:", data.current);
})();
