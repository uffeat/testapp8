// value_effects


/* Purpose: Demonstate and test Value.effects */
await (async () => {
 
  const { Value } = await import("rollo/type/types/value/value");
  
  const foo = Value.create("foo");
  
  foo.effects.add((change) => {
    console.log(`current:`, change.current);
    console.log(`previous:`, change.previous);
  });

  foo.current = "FOO";
  console.log(`current:`, foo.current);

  
})();