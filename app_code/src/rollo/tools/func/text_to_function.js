export function text_to_function(text) {
  return Function("...args", `return (${text})(...args)`);
}