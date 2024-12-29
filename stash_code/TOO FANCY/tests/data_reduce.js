// data_reduce

/* Purpose: Demonstate and test Data.reduce */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
    thing: 7,
  });

  /* Get sum of all items with number values */
  const sum = data.reduce(
    (data) => data.values.filter((v) => typeof v === "number"),
    (numbers) => {
      let sum = 0;
      numbers.forEach((v) => (sum += v));
      return sum;
    }
  );

  const expected = 49;
  if (sum === expected) {
    console.log(`Success! Reduced to: ${sum}`);
  } else {
    console.error(`Expected: ${expected}. Actual: ${sum}`);
  }
})();
