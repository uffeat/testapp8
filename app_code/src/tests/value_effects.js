/* Purpose: Demonstate and Value.effects */
await (async () => {
  const { Value } = await import("rollo/type/types/value/value");
  
  const value = Value(42);

  value.effects.add((change) => {
    console.log('curernt:', change.current)
  })

  value.$ = 'foo'
  

})();