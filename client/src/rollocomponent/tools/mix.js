/*
import { mix } from "@/rollocomponent/tools/mix.js";
const { mix } = await use("@/rollocomponent/tools/mix.js");
20250530
v.1.0
*/

export const mix = (cls, config, ...mixins) => {
  for (const mixin of mixins) {
    cls = mixin(cls, config);
  }
  return cls;
};
