export const get_css_var = (element, name) => {
  /* By convention, false signals that CSS var cannot be retrieved */
  if (!element.isConnected) {
    return false
  }
  /* Normalize name */
  if (!name.startsWith("--")) {
    name = `--${name}`;
  }
  const computed = getComputedStyle(element);
  const value = computed.getPropertyValue(name).trim();
  /* By convention, null signals absence of CSS var */
  if (!value) return null;
  const priority = element.style.getPropertyPriority(name);
  if (priority) return `${value} !${priority}`;
  return value;
};

export const set_css_var = (element, name, value) => {
  /* By convention, undefined aborts. Allows use of ternaries and iife's */
  if (value === undefined) return;
  /* Normalize name */
  if (!name.startsWith("--")) {
    name = `--${name}`;
  }
  /* By convention, null removes */
  if (value === null) {
    target.style.removeProperty(name);
  } else {
    /* Handle priority */
    value = value.trim();
    if (value.endsWith("!important")) {
      element.style.setProperty(
        name,
        value.slice(0, -"!important".length),
        "important"
      );
    } else {
      element.style.setProperty(name, value);
    }
  }
};
