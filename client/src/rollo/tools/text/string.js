export const string = new Proxy({}, {
  get(target, key) {
    return key.replaceAll("_", "-");
  },
});