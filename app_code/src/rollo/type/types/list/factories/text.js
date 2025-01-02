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
    /* Tests, if values are json-compatible.
    NOTE
    - Only valid for flat data.
    */
    get jsonable() {
      return (
        this.values.filter(
          (v) =>
            v === null || ["boolean", "number", "string"].includes(typeof v)
        ).length === this.values.length
      );
    }

    /* Retuns json representation of current values.
    NOTE
    - Error, if items are not json-compatible. 
    - Use when items are json-compatible; otherwise, use 'text()' 
    - 'sort' option can be used to hash current values. 
    */
    json(sort = false) {
      if (!this.jsonable) {
        throw TypeError(`Cannot convert to json.`);
      }
      if (sort) {
        return `{${this.current
          .sort()
          .map((k) => JSON.stringify({ [k]: this[k] }).slice(1, -1))
          .join(",")}}`;
      }
      return JSON.stringify(this);
    }

    /* Retuns json-like text representation of current values.
    NOTE
    - NO error, if items are not json-compatible.
    - Relies on native toString for json-incompatible values.
    - Use when items may not be json-compatible; otherwise, use 'json()'. 
    - 'sort' option can be used to hash current values.
    */
    text(sort = false) {
      const mapped = this.current.map((k) => {
        const v = this[k];
        if (["string"].includes(typeof v)) {
          return `"${k}":"${String(v)}"`;
        }
        return `"${k}":${String(v)}`;
      });
      if (sort) {
        return `{${mapped.sort().join(",")}}`;
      }
      return `{${mapped.join(",")}}`;
    }

    toString() {
      return this.jsonable ? this.json() : this.text();
    }
  };
};
