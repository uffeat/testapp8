export const query = new (class Query {
  /* Returns object representation of query string. */
  objectify(text) {
    const result = {};
    for (const [key, value] of new URLSearchParams(text).entries()) {
      if (value === "false") {
        result[key] = false;
        continue;
      }
      if (value === "null") {
        result[key] = null;
        continue;
      }
      if (value === "true") {
        result[key] = true;
        continue;
      }
      if (value === "undefined") {
        continue;
      }
      const number = Number(value);
      result[key] = isNaN(number) ? value || true : number;
    }

    return result;
  }

  /* Returns query string representation of object. */
  stringify(object) {
    return new URLSearchParams(object).toString();
  }
})();
