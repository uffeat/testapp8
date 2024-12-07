export function is_node(arg) {
  return (
    arg instanceof HTMLElement ||
    typeof arg === "number" ||
    typeof arg === "string"
  );
}
