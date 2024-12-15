/* Factory that provides 'is_css' method. */
export const is_css = (parent, config, ...factories) => {
 
  const cls = class IsCss extends parent {
    /* Checks if key is a valid CSS key. */
    is_css(key) {
      return (
        typeof key === "string" && (key.startsWith("--") || key in this.style)
      );
    }
  };

  return cls;
};
