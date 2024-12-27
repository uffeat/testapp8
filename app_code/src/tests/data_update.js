// data_update

await (async () => {
  const { Data } = await import("rollo/type/types/data/data");
  /* Create data object */
  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
  });
  /* Set up catch-all effect */
  data.effects.add(({ current, previous, publisher, session }) => {
    console.log(`'previous' from effect:`, previous);
    console.log(`'current' from effect:`, current);
    console.log(`'session' from effect:`, session);
  });
  /* Change single data item in different ways */
  data.foo = "changed foo";
  data({ foo: "changed foo again" });
  /* Batch-change multipe data items */
  data({ foo: "FOO", bar: "BAR" });
  /* Delete single data item in different ways */
  data.foo = undefined;
  data({ bar: undefined });
  /* Check */
  const expected = { stuff: 42 };
  if (data.match(expected)) {
    console.log(`All good!`);
  } else {
    console.error(`Expected:`, expected, `Got:`, data.data);
  }
})();
