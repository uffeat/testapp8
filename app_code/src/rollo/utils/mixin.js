export const mixin = (target, source, ...args) => {
  for (const [name, descriptor] of Object.entries(
    Object.getOwnPropertyDescriptors(source)
  )) {
    if (name === "constructor") continue;
    if (name === "__init__") {
      descriptor.value.call(target, ...args);
      continue;
    }
    Object.defineProperty(target, name, descriptor);
  }
  return target
}