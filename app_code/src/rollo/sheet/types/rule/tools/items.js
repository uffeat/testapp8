export function get(rule) {
  const items = {};
  const style = rule.style;
  for (let index = 0; index < style.length; index++) {
    const key = style[index];
    const priority = style.getPropertyPriority(key);
    const value = style.getPropertyValue(key);
    items[key] = priority ? `${value} !${priority}` : value;
  }
  return items;
}

