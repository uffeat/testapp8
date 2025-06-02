import { define } from "@/rollocomponent/tools/define.js";
import { factory } from "@/rollocomponent/tools/factory.js";

export const author = (tag, cls) => factory(define(tag, cls));
