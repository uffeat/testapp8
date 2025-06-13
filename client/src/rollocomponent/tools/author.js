/*
import { author } from "@/rollocomponent/tools/author.js";
20250605
v.1.0
*/


import { factory } from "@/rollocomponent/tools/factory.js";
import { registry } from "@/rollocomponent/tools/registry.js";

/* Defines autonomous web component and returns instance factory function.
NOTE
- If tag is not explicitly provided, a static __tag__ prop on cls is used. */
export const author = (cls, key) => {
  
  return factory(registry.add(cls, key));
};
