// data_clear

/* Purpose: Demonstate and test Data.clear */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
  });

  data.clear();
  if (data.size) {
    console.error(`Did not clear... Current:`, data.current);
  } else {
    console.log(`Cleared successfully... Current:`, data.current);
  }
})();
