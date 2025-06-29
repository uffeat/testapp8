/*
import { author } from "@/rollocomponent/tools/author.js";
20250605
v.1.0
*/


import { factory } from "@/rollocomponent/tools/factory.js";
import { registry } from "@/rollocomponent/tools/registry.js";

/* Defines web component and returns instance factory function. */
export const author = (cls, key, native) => {
  return factory(registry.add(cls, key, native));
};
