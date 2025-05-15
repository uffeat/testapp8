/* 
20250304
src/rollo/tools/assign.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/tools/assign.js
*/

/* Assigns members of source classes' prototypes onto target
(and returns target).
NOTE
- Constructors in sources classes are ignored, i.e., cannot be used
- Sources classes cannot use 'super' and private fields 
  (unless target exposes a wrapped version of its super)
- Target members may be overwritten without warning.
*/
export const assign = (target, ...sources) => {
  sources.forEach((source) =>
    Object.defineProperties(
      target,
      Object.getOwnPropertyDescriptors(source.prototype)
    )
  );
  return target;
}