/* Implements features related to text representation.
Useful for:
- Serialization before storage.
- Serialization sending over the wire.
- Hashing.
- Logging.
 */
export const text = (parent, config, ...factories) => {
  return class extends parent {
    static name = "text";

    /* Retuns json-like text representation of current.
    NOTE
    - 'sort' option can be used to hash current.
    */
    text(sort = false) {
      const mapped = this.current.map((v) => {
        if (typeof v === "string") return `"${String(v)}"`;
        return String(v);
      });
      if (sort) {
        return `[${mapped.sort().join(",")}]`;
      }
      return `[${mapped.join(",")}]`;
    }

    
    toString() {
      return this.text();
    }
    
  };
};
