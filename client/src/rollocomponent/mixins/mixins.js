/*
import { mixins } from "@/rollocomponent/mixins/mixins.js";
const { mixins } = await use("@/rollocomponent/mixins/");

*/

const names = [
  "append",
  "attrs",
  "classes",
  "clear",
  "components",
  "connect",
  "detail",
  "find",
  "for_",
  "handlers",
  "hooks",
  "host",
  "host",
  "insert",
  "key",
  "novalidation",
  "parent",
  'props',
  "send",
  "setup",
  "states",
  "style",
  "super_",
  "tab",
  "tree",
  "text",
  "vars",
];

const mixins = {};
for (const name of names) {
  mixins[name] = (
    await use(`@/rollocomponent/mixins/mixins/${name}.js`)
  ).default;
}
Object.freeze(mixins);



export { mixins };
