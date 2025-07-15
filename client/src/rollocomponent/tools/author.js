/*
import { author } from "@/rollocomponent/tools/author.js";
20250605
v.1.0
*/

const { factory } = await use("@/rollocomponent/tools/factory.js");
const { registry } = await use("@/rollocomponent/tools/registry.js");

/* Defines web component and returns instance factory function. */
export const author = (cls, key, native) => {
  return factory(registry.add(cls, key, native));
};
