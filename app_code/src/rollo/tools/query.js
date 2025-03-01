class Query {
  /* Returns object representation of query string. */
  to_object(text) {
    return Object.fromEntries(new URLSearchParams(text));
  }

  /* Returns query string representation of object. */
  to_text(object) {
    return new URLSearchParams(object).toString();
  }
}

export const query = new Query();

