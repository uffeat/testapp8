export const tab = (parent, config, ...factories) => {
  return class extends parent {
    static name = "tab";

    get tabIndex() {
      return this.getAttribute("tabindex");
    }
    set tabIndex(tabindex) {
      if ([false, null].includes(tabindex)) {
        this.removeAttribute("tabindex");
       
      } else {
        this.setAttribute("tabindex", tabindex);
      }
    }
  };
};
