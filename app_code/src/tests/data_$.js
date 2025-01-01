// data_$

/* Purpose: Demonstate and test Data.$ */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data({
    foo: "foo",
  });

  const result = []
  /* Set up effect to watch changes */
  data.effects.add((change) => {
    ////console.log(`current:`, change.current);
    result.push(change.current.foo)
  });

  data.$.foo = 42;
  data.$.foo = 42;
  data.$.foo = undefined;

  (() => {
    const expected = ['foo', 42, undefined]
    const difference = new Set(expected).difference(new Set(result))
    if (!difference.size) {
      console.log(`Success!`);
    } else {
      console.error('Expected:', expected, ' Actual:', result);
    }
  })();



  //console.log("data.data:", data.data);
})();
