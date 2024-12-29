/* Adds meta property to target. */
export function add_meta(target, name, value) {
  Object.defineProperty(target, `__${name}__`, {
    configurable: false,
    enumerable: false,
    writable: false,
    value,
  });
  return target;
}