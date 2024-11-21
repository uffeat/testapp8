/* Use with small source classes. */
export function mixin(source, ...args) {
  for (const [name, descriptor] of Object.entries(
    Object.getOwnPropertyDescriptors(source.prototype)
  )) {
    if (name === "__init__") {
      descriptor.value.call(this, ...args);
      continue;
    }
    Object.defineProperty(this, name, descriptor);
  }
  return this;
}