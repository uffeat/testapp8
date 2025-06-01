/*
import { define } from "@/rollocomponent/tools/define.js";
const { define } = await use("@/rollocomponent/tools/define.js");
20250530
v.1.0
*/

export const define = (tag, cls) => {
  tag = `rollo-${tag.toLowerCase()}`;
  customElements.define(tag, cls);
  if (import.meta.env.DEV) {
    console.info("Registered component with tag:", tag);
  }
  return cls
};
