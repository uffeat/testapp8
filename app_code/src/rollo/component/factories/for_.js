export const for_ = (parent, config, ...factories) => {
  return class extends parent {
    static name = "for_";

    get for_() {
      return this.getAttribute("for");
    }
    set for_(for_) {
      if (for_) {
        this.setAttribute("for", for_);
      } else {
        this.removeAttribute("for");
      }
    }
  };
};
