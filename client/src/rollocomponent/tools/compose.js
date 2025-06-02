
import { MIXINS } from "@/rollocomponent/tools/mixins.js";
import { mix } from "@/rollocomponent/tools/mix.js";

export const compose = (...mixins) =>
  mix(HTMLElement, {}, ...MIXINS.create(...mixins));
