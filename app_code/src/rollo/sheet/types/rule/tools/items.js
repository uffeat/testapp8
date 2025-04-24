/* 
20250302 
src/rollo/sheet/types/rule/tools/items.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/sheet/types/rule/tools/items.js
*/
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

