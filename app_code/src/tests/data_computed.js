// data_computed

/* Purpose: Demonstate and test Data.computed. */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data({
    foo: "foo",
    bar: "bar",
    stuff: 42,
  });

  
  let result = "";

  data.computed
    .add(
      "sum",
      /* Reducer */
      () =>
        data.reduce(
          () => data.values.filter((v) => typeof v === "number"),
          (v) => {
            let sum = 0;
            v.forEach((v) => (sum += v));
            return sum;
          }
        )
    )
    .effects.add(
      /* Effect to watch computed value */
      () => {
        ////console.log("sum:", data.sum);
        result += String(data.sum);
      }
    );

  data.$.foo = 8;

  /* Verify */
  (() => {
    const expected = "4250";
    const message = `Expected ${expected}. Actual: ${result}`;
    if (result === expected) {
      console.log(`Success! ${message}`);
    } else {
      console.error(message);
    }
  })();
})();