/* Returns object with style items suitable for visually hiding elements in a 
way that's screen-reader friendly.
NOTE
- Especially useful for input elements.
- Using visibility is not screen-reader friendly! */
export const hidden = Object.freeze({
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: "0",
})