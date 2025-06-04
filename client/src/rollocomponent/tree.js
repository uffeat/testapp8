/*
import { Tree } from "@/rollocomponent/tree.js";
20250604
v.1.0
*/

import { author } from "@/rollocomponent/tools/author.js";
import { compose } from "@/rollocomponent/tools/compose.js";

const cls = class extends compose() {
  static tag = "rollo-tree";
  constructor() {
    super();
  }
};

/* Returns instance of tree component. */
export const Tree = author(cls);
