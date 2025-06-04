/*
import { author } from "@/rollocomponent/tools/author.js";
20250605
v.1.0
*/

import { define } from "@/rollocomponent/tools/define.js";
import { factory } from "@/rollocomponent/tools/factory.js";

/* Defines autonomous web component and returns instance factory function.
NOTE
- If tag is not explicitly provided, a static tag prop on cls is used. */
export const author = (cls, tag) => {
  if (!tag) {
    tag = cls.tag
  }
  return factory(define(tag, cls));
};
