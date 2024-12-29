/* Assigns members of source classes' prototypes onto target
(and returns target).
NOTE
- Constructors in sources classes are ignored, i.e., cannot be used
- Sources classes cannot use 'super' and private fields
- Target members may be overwritten without warning.
Use cases:
- Crude alternative/supplement to 'type.compose', if the class' prototype is 
  passed in as 'target'.
- Instance-level modification (memory inefficient). */
export function assign(target, ...sources) {
  sources.forEach((source) =>
    Object.defineProperties(
      target.prototype,
      Object.getOwnPropertyDescriptors(source.prototype)
    )
  );
  return target;
}