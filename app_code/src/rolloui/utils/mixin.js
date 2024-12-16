/* Assigns members from source to target.
Useful for adding props to a component instance/element. */
export const mixin = (target, source) => {
  for (const [name, descriptor] of Object.entries(
    Object.getOwnPropertyDescriptors(source.prototype)
  )) {
    if (name === "constructor") continue;
    Object.defineProperty(target, name, descriptor);
  }
  return target
}