/*
import { mixins } from "@/rollocomponent/tools/mixins.js";
20250605
v.1.0
*/

import append from "@/rollocomponent/mixins/append.js";
import attrs from "@/rollocomponent/mixins/attrs.js";
import classes from "@/rollocomponent/mixins/classes.js";
import clear from "@/rollocomponent/mixins/clear.js";
import components from "@/rollocomponent/mixins/components.js";
import connect from "@/rollocomponent/mixins/connect.js";
import effect from "@/rollocomponent/mixins/effect.js";
import find from "@/rollocomponent/mixins/find.js";
import for_ from "@/rollocomponent/mixins/for_.js";
import handlers from "@/rollocomponent/mixins/handlers.js";
import hooks from "@/rollocomponent/mixins/hooks.js";
import host from "@/rollocomponent/mixins/host.js";
import insert from "@/rollocomponent/mixins/insert.js";
import key from "@/rollocomponent/mixins/key.js";
import novalidation from "@/rollocomponent/mixins/novalidation.js";
import parent from "@/rollocomponent/mixins/parent.js";
import props from "@/rollocomponent/mixins/props.js";
import send from "@/rollocomponent/mixins/send.js";
import setup from "@/rollocomponent/mixins/setup.js";
import shadow from "@/rollocomponent/mixins/shadow.js";
import state from "@/rollocomponent/mixins/state.js";
import style from "@/rollocomponent/mixins/style.js";
import tab from "@/rollocomponent/mixins/tab.js";
import text from "@/rollocomponent/mixins/text.js";
import tree from "@/rollocomponent/mixins/tree.js";
import vars from "@/rollocomponent/mixins/vars.js";

const registry = Object.freeze({
  append,
  attrs,
  classes,
  clear,
  components,
  connect,
  effect,
  find,
  for_,
  handlers,
  hooks,
  host,
  insert,
  key,
  novalidation,
  parent,
  props,
  send,
  setup,
  shadow,
  state,
  style,
  tab,
  text,
  tree,
  vars,
});

const standard = Object.freeze([
  append,
  attrs,
  classes,
  clear,
  components,
  connect,
  effect,
  find,
  handlers,
  hooks,
  host,
  insert,
  key,
  parent,
  props,
  send,
  setup,
  state,
  style,
  tab,
  vars,
]);


/* */
export const mixins = new (class {
  get standard() {
    return standard
  }

  get(name) {
    if (!(name in registry)) {
    throw new Error(`Invalid name: ${name}`);
  }
    return registry[name]
  }


  /* Returns array of mixins based on standard.
  'mixin_name' includes from registry
  '!mixin_name' excludes from standard */
  select(...args) {
    if (!args.length) {
      return [...standard];
    }

    const result = [];

    const add = args.filter((arg) => !arg.startsWith("!"));
    const remove = args.filter((arg) => arg.startsWith("!"));

    /* Add from standard, if not in remove */
    for (const name of standard) {
      if (!remove.includes(name)) {
        result.push(name);
      }
    }
    /* Add from registry, if in add */
    for (const name of add) {
      result.push(registry[name]);
    }

    return result;
  }
})();


