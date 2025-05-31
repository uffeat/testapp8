import append from "@/rollocomponent/mixins/append.js";
import attrs from "@/rollocomponent/mixins/attrs.js";
import classes from "@/rollocomponent/mixins/classes.js";
import clear from "@/rollocomponent/mixins/clear.js";
import connect from "@/rollocomponent/mixins/connect.js";
import effect from "@/rollocomponent/mixins/effect.js";
import find from "@/rollocomponent/mixins/find.js";
import handlers from "@/rollocomponent/mixins/handlers.js";
import hooks from "@/rollocomponent/mixins/hooks.js";
import host from "@/rollocomponent/mixins/host.js";
import insert from "@/rollocomponent/mixins/insert.js";
import key from "@/rollocomponent/mixins/key.js";
import parent from "@/rollocomponent/mixins/parent.js";
import props from "@/rollocomponent/mixins/props.js";
import send from "@/rollocomponent/mixins/send.js";
import setup from "@/rollocomponent/mixins/setup.js";
import style from "@/rollocomponent/mixins/style.js";
import tab from "@/rollocomponent/mixins/tab.js";
import vars from "@/rollocomponent/mixins/vars.js";

/* Mixins that should typically be used for composing web component classes. */
export const mixins = Object.freeze([
  append,
  attrs,
  classes,
  clear,
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
  style,
  tab,
  vars,
]);
