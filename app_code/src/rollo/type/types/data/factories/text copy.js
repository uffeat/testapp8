/* Implements features related to text representation. */
export const text = (parent, config, ...factories) => {
  return class text extends parent {
    /* Tests, if items are json-compatible */
    get jsonable() {
      return (
        Object.values(this.current).filter(
          (v) =>
            v === null || ["boolean", "number", "string"].includes(typeof v)
        ).length === Object.values(this.current).length
      );
      /* Alternative implementation:
      try {
        JSON.stringify(this.current);
        return true
      } catch {
        return false
      }
      */
    }

    /* Retuns json representation of items.
    NOTE
    - Error, if items are not json-compatible. 
    - Use when items are json-compatible; otherwise, use 'text()' 
    - sort option can be used to hash items. */
    json(sort = false) {
      if (!this.jsonable) {
        throw TypeError(`Cannot convert to json.`);
      }
      if (sort) {
        const parts = [];
        for (const key of Object.keys(this.current).sort()) {
          const part = JSON.stringify({ [key]: this.current[key] });
          parts.push(part.slice(1, -1));
        }
        return `{${parts.join(",")}}`;
      }
      return JSON.stringify(this.current);
    }

    /* Retuns text representation of items.
    NOTE
    - NO error, if items are not json-compatible.
    - Result may not be fully human-readable.
    - Use when items may not be json-compatible; otherwise, use 'json()'. */
    text(sort = false) {
      


      return `{${Object.entries(this.current)
        .map(([k, v]) => {
          if (["boolean", "number"].includes(typeof v)) {
            return `"${k}":${String(v)}`;
          }
          return `"${k}":"${String(v)}"`;
        })
        .join(",")}}`;
    }

    toString() {
      return this.jsonable ? this.json() : this.text();
    }
  };
};
