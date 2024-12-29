export function capitalize(text) {
  if (text.length > 0) {
    text = text[0].toUpperCase() + text.slice(1);
  }
  return text;
}