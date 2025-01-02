// list_effects

/* Purpose: Demonstate and test List.effects */
await (async () => {
  const { List } = await import("rollo/type/types/list/list");

  const list = List(1, 2, 3);

  /* Prepare test */
  let actual = "";

  list.effects.add(({ data: { added, removed }, session = 0 }) => {
    ////console.log("added:", added);
    ////console.log("removed:", removed);

    const expected = 3;
    if (session > expected - 1) {
      console.error(
        `Effect ran ${session + 1} times. Expected: ${expected} times.`
      );
    }

    if (added) {
      actual += JSON.stringify(added);
    }
    if (removed) {
      actual += JSON.stringify(removed);
    }
  });

  list.add(4, 5);
  list.add(5);
  list.remove(3);
  list.remove(3);
  list.remove(0, 10);

  /* Check test result */
  (() => {
    const expected = "[1,2,3][4,5][3]";
    const message = `Expected ${expected}. Actual: ${actual}`;
    if (actual === expected) {
      console.log(`Success! ${message}`);
    } else {
      console.error(message);
    }
  })();

  ////console.log("current:", list.current);
  ////console.log("current:", list.values);
})();