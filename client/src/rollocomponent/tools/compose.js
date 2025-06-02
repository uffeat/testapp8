import { index } from "@/rollocomponent/mixins/__index__.js";
import { mix } from "@/rollocomponent/tools/mix.js";

export const compose = (...mixins) => mix(HTMLElement, {}, ...index.create(...mixins));