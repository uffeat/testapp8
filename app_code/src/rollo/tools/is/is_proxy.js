export function is_proxy(value) {
  if (value.constructor && value.constructor.name === "Proxy") return true;
  return false;
}