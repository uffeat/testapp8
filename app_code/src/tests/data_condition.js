// data_condition

//* Purpose: Demonstate and test Data.conditional */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  /* Create data that silently ignores attempts to set an item to a 
  non-number value. */
  const data = Data({
    foo: "foo",
    bar: "bar",
    stuff: 42,
    condition: ([k, v]) => {
      if (typeof v === "number") {
        return true;
      }
      /* NOTE
      - A more restrictive implementation could throw an error here.
      */
      ////console.log(`Ignoring attempt to set '${k}' to ${v}`);
      return false;
    },
  });

  /* Set up effect to watch that the condition works. */
  data.effects.add(({ current }) => {
    Object.values(current).forEach((v) => {
      if (typeof v !== "number") {
        throw new Error(`Got an item with non-number value: ${v}`);
      }
    });
  });

  /* Change data */
  data.update({ bar: 8, stuff: undefined });
  data.__name__ = "uffe";

  /* Check final result */
  const expected = { bar: 8, stuff: 42 };
  if (data.match(expected)) {
    console.log(`Success! Data:`, data.data);
  } else {
    console.error(`Expected:`, expected, `Actual:`, data.data);
  }
})();