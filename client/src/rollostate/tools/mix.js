export default (config, ...mixins) => {
  let cls = class {}
  for (const mixin of mixins) {
    cls = mixin(cls, config);
  }
  return cls;
};