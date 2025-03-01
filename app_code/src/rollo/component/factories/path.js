export const path = (parent, config, ...factories) => {
  return class extends parent {
    static name = "path";

    get path() {
      return this.getAttribute("path");
    }
    set path(path) {
      if (path) {
        this.setAttribute("path", path);
      } else {
        this.removeAttribute("path");
      }
    }
  };
};
