import { is_class } from "rollo/type/tools/is_class";

/* Creates and returns an array of classes in the prototype chain of a class 
instance. */
export function create_chain(instance) {
  if (!instance.constructor) {
    throw new TypeError(`'instance' does not have a constructor.`)
  }
  const chain = [];
  let cls = instance.constructor;
  if (!is_class(cls)) {
    throw new TypeError(`constructor of 'instance' is not a class.`)
  }
  while (is_class(cls)) {
    chain.push(cls);
    cls = Object.getPrototypeOf(cls);
  }
  return chain
}