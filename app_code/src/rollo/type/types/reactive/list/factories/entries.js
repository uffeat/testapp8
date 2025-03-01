export const entries = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'entries'

    /* Returns entries.
    NOTE
    - Use for enumerated looping.
    */
    get entries() {
      return this.current.entries();
    }
    
    
  };
};
