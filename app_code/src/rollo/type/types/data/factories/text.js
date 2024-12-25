/* Implements features related to text representation. */
export const text = (parent, config, ...factories) => {
  return class text extends parent {
    /* Tests, if items are json-compatible */
    get jsonable() {
      return (
        Object.values(this).filter(
          (v) =>
            v === null || ["boolean", "number", "string"].includes(typeof v)
        ).length === Object.values(this).length
      );
      /* Alternative implementation:
      try {
        JSON.stringify(this);
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
        for (const key of Object.keys(this).sort()) {
          const part = JSON.stringify({ [key]: this[key] });
          parts.push(part.slice(1, -1));
        }
        return `{${parts.join(",")}}`;
      }
      return JSON.stringify(this);
    }

    /* Retuns text representation of items.
    NOTE
    - NO error, if items are not json-compatible.
    - Result may not be fully human-readable.
    - Use when items may not be json-compatible; otherwise, use 'json()'. */
    text() {
      return `{${Object.entries(this)
        .map(([k, v]) => `${k}:${String(v)}`)
        .join(",")}}`;
    }

    toString() {
      return this.jsonable ? this.json() : this.text();
    }
  };
};
