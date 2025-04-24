export const accepts_shadow = (element) => {
  try {
    element.attachShadow({ mode: "open" });
    return true
  } catch {
    return false
  }
}