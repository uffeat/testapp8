// list_clear

/* Purpose: Demonstate and test List.clear */
await (async () => {
  const { List } = await import("rollo/type/types/list/list");

  const list = List(1, 2, 3);

  list.clear();

  /* Prepare test */
  let actual = "";

  /* Verify */
  (() => {
    const expected = "42";
    const message = `Expected ${expected}. Actual: ${actual}`;
    if (actual === expected) {
      console.log(`Success! ${message}`);
    } else {
      //console.error(message);
    }
  })();

  ////console.log("current:", list.current);
  ////console.log("current:", list.values);
})();
