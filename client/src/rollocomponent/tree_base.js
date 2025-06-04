/*
import { TreeBase } from "@/rollocomponent/tree_base.js";
20250604
v.1.0
*/


import { mix } from "@/rollocomponent/tools/mix.js";
import { mixins } from "@/rollocomponent/mixins/__init__.js";

export class TreeBase extends mix(
  HTMLElement,
  {},
  mixins.attrs,
  mixins.classes,
  mixins.clear,
  mixins.components,
  mixins.connect,
  mixins.find,
  mixins.handlers,
  mixins.hooks,
  mixins.host,
  mixins.key,
  mixins.parent,
  mixins.props,
  mixins.send,
  mixins.state,
  mixins.style,
  mixins.tab,
  mixins.text,
  mixins.tree,
  mixins.vars
) {
  constructor() {
    super();
  }
}
