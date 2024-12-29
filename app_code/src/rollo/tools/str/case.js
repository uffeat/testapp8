export function camel_to_kebab(camel) {
  /* NOTE Digits are treated as lower-case characters, 
  i.e., p10 -> p10. */
  return camel.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export function camel_to_snake(camel) {
  const kebab = this.camel_to_kebab(camel);
  const snake = kebab.replaceAll("-", "_");
  return snake;
}

export function kebab_to_camel(kebab) {
  return kebab.replace(/-([a-z])/g, function (match, capture) {
    return capture.toUpperCase();
  });
}

export function pascal_to_camel(pascal) {
  if (pascal.length === 0) return pascal;
  return pascal[0].toLowerCase() + pascal.slice(1);
}

export function pascal_to_kebab(pascal) {
  return pascal
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");
}

export function snake_to_camel(snake) {
  const kebab = snake.replaceAll("_", "-");
  return this.kebab_to_camel(kebab);
}



