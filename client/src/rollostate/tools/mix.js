export default (cls, config, ...mixins) => {
  for (const mixin of mixins) {
    cls = mixin(cls, config);
  }
  return cls;
};