export function use_css(css) {
  return function () {
    if (css) {
      if (Array.isArray(css)) {
      } else {
        css = css.split(".");
      }
      this.classList.add(...css);
    }
  };
}