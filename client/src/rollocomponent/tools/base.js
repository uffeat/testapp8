/*
import { Base, base } from "@/rollocomponent/base.js";
20250615
v.1.0
*/

import { mix } from "@/rollocomponent/tools/mix.js";
import { mixins } from "@/rollocomponent/mixins/__init__.js";



export const base = (..._mixins) => {
  return class Base extends mix(
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
    mixins.insert,
    mixins.key,
    mixins.parent,
    mixins.props,
    mixins.send,
    mixins.shadow,
    mixins.state,
    mixins.style,
    mixins.tab,
    mixins.text,
    mixins.vars,
    ..._mixins
  ) {
    constructor() {
      super();
    }
  };
};
