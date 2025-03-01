export const owner = (parent, config, ...factories) => {
  return class extends parent {
    static name = "owner";

  
    #owner;
  

    /* Returns owner. */
    get owner() {
      return this.#owner;
    }
    /* Sets owner. */
    set owner(owner) {
      this.#owner = owner;
    }

    /* */
    anscestors() {
      const anscestors = []
      let owner = this.owner
      while (owner) {
        anscestors.push(owner)
        owner = owner.owner
      }
      return anscestors
    }

   
  };
};
