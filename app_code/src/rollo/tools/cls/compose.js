export const compose = (cls, config, ...factories) => {
  if (!cls) {
    cls = class {};
  }
  for (const factory of factories) {
    cls = factory(cls, config, ...factories);
  }
  return cls;
};
