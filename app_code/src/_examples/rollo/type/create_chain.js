
/* Purpose: Demonstrate and test create_chain and __chain__ */
await (async () => {
  const { create_chain } = await import("rollo/type/tools/create_chain");
  const { Data } = await import("rollo/type/types/data/data");
  const { List } = await import("rollo/type/types/list/list");

  const data = Data();

  /* Verify that the array returned from create_chain contains the same 
  classes as __chain__ */
  if (List(data.__chain__.classes).match(create_chain(data))) {
    console.log(`Success!`);
  } else {
    console.error(
      `create_chain does not match __chain__ with respect to classes`
    );
  }

  /* Verify that the classes in the array returned from create_chain are 
  ordered as in __chain__ */
  if (
    JSON.stringify([...data.__chain__.names]) ===
    JSON.stringify(create_chain(data).map((cls) => cls.name))
  ) {
    console.log(`Success!`);
  } else {
    console.error(
      `create_chain does not match __chain__ with respect to ordered class names`
    );
  }
})();