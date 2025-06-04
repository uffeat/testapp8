/*
import { TreeHostFactory } from "@/rollocomponent/tree_host.js";
20250604
v.1.0
*/

import { author } from "@/rollocomponent/tools/author.js";
import { compose } from "@/rollocomponent/tools/compose.js";
import { Tree } from "@/rollocomponent/tree.js";
import { State } from "@/rollocomponent/tools/state.js";


const TreeHostFactory = (_tree) => {
  class TreeHost extends compose("tree", "!append", "!insert") {
    static tree = () => {
      return () => Tree(_tree(new State()));
    };
    constructor() {
      super();
    }
  }

  return TreeHost
};


