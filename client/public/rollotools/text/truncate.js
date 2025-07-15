
/* Returns a representation of text without white-space characters,
optionally with single spaces preserved.
NOTE
- White-space characters include
  - space (' ')
  - tab ('\t')
  - newline ('\n')
  - carriage return ('\r')
  - vertical tab ('\v')
  - form feed ('\f') 
*/
export const truncate = (text, space=true) => {
  if (space) {
    return text
  // Remove all whitespace except the ordinary space.
  .replace(/[^\S ]/g, '')
  // Replace any occurrence of 2 or more spaces with a single space.
  .replace(/ {2,}/g, ' ')
  .trim();
  }
  return text.replace(/\s/g, '');
  /* To also remove, e.g., zero-width space \u200B and the byte order mark \uFEFF, use: */
  //return text.replace(/\p{White_Space}|\u200B|\uFEFF/gu, "");
};
