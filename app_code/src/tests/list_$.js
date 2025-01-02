// list_$

/* Purpose: Demonstate and test List.$ */
await (async () => {
  const { List } = await import("rollo/type/types/list/list");

  const list = List();

  /* NOTE
  - The '$' Can only be used for json-compatible values
  - Fails silently otherwise!!!
  */
  list.$[4.45];
  list.$.uffe;
  list.$.true;
  list.$.false;
  list.$.null;
  list.$[4.45];
  list.$["foo-bar"];

  list.json();

  const actual = JSON.stringify(list.current);
  const expected = `[4.45,"uffe",true,false,null,"foo-bar"]`;
  if (actual === expected) {
    console.log(`Success!`);
  } else {
    console.error(`Expected:`, expected, ` Actual:`, actual);
  }

  console.log("current:", list.current);
  ////console.log("current:", list.values);
})();