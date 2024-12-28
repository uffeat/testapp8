// data_clone

/* Purpose: Demonstate and test Data.clone */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const original = Data.create({
    foo: "foo",
    bar: "bar",
  });
  const clone = original.clone();

  /* Change original and clone */
  original.clear();
  clone.stuff = 42;

  /* Check that original has been changed independently of clone */
  if (original.empty) {
    console.log(`Success! Original:`, original.data);
  } else {
    console.error(`Something went wrong! Original:`, original.data);
  }

  /* Check that clone 
  - has the items of original as-were at cloning
  - has been changed independently of original 
  */
  (() => {
    const expected = { foo: "foo", bar: "bar", stuff: 42 };
    if (clone.match(expected)) {
      console.log(`Success! Clone:`, clone.data);
    } else {
      console.error(`Expected:`, expected, `Got:`, clone.data);
    }
  })();
})();
