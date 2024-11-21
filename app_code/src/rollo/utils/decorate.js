/* */
export function decorate(constructor, ...decorators) {
  for (const decorator of decorators) {
    constructor = decorator(constructor);
  }
  return constructor;
}