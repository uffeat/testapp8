export function use_css(css) {
  return function () {
    if (css) {
      if (Array.isArray(css)) {
        css = css.filter(c => c !== undefined)
      } else {
        css = css.split(".");
      }
      this.classList.add(...css);
    }
  };
}