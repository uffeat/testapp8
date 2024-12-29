/* Implements bind/unbind. */
export const bind = (parent, config, ...factories) => {
  return class bind extends parent {
    

    /* Short-hand for 'subscriptions.add'. Chainable */
    bind(publisher, source, condition) {
      if (!source) {
        source = (change) => this.update(change.current)
      }
      this.subscriptions.add(publisher, source, condition)
      return this

    }

    /* Short-hand for 'subscriptions.remove'. Chainable */
    unbind(publisher) {
      this.subscriptions.remove(publisher)
      return this
      
    }
  };
};

