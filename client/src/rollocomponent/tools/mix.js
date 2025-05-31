export const mix = (cls, config, ...mixins) => {
  for (const mixin of mixins) {


    



    cls = mixin(cls, config);
  }
  return cls;
}
