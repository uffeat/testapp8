// data_change

/* Purpose: Demonstate and test change argument */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data();

  data.effects.add((change) => {
    ////console.log(`current:`, change.current);
  });

  data.effects.add((change) => {
    change.stop();
    /* Alternatively: */ 
    //return false
  });

  data.effects.add((change) => {
    /* Check that 'change.stop()' works */
    if (change.session) {
      throw new Error(`'change.stop()' does NOT work!`);
    }
  });

  data.update({ foo: "FOO", bar: "BAR", stuff: 42 });
})();
