/* Implements features related to text representation.
Useful for:
- Serialization before storage.
- Serialization sending over the wire.
- Hashing.
- Logging. */
export const text = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'text'
    
    

    

    /* Retuns json-like text representation of current.
    NOTE
    - 'sort' option can be used to hash current da. */
    text(sort = false) {
      if (sort) {
        return `{${this.keys
          .sort()
          .map((k) => {
            const v = this.current[k];
            if (["string"].includes(typeof v)) {
              return `"${k}":"${String(v)}"`;
            }
            return `"${k}":${String(v)}`;
          })
          .join(",")}}`;
      }
      return `{${this.entries
        .map(([k, v]) => {
          if (["string"].includes(typeof v)) {
            return `"${k}":"${String(v)}"`;
          }
          return `"${k}":${String(v)}`;
        })
        .join(",")}}`;
    }

    toString() {
      return this.text();
    }
  };
};
