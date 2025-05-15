/* 
20250302 
src/rollo/tools/cls/compose.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/tools/cls/compose.js
*/

/* Returns class composed from base class and factories.
NOTE
- Provides synthetic multiple inheritance. 
- 'config' is passed into each factory. 
  Can be used as a mechanism to provide shared data among factories.
  Likely, only relevant for special cases.
- 'factories' are passed into each factory.
  Can be used to, e.g., check factory dependencies.
  Likely, only relevant for special cases. */
export const compose = (cls, config, ...factories) => {
  if (!cls) {
    cls = class {};
  }
  for (const factory of factories) {
    cls = factory(cls, config, ...factories);
  }
  return cls;
};


