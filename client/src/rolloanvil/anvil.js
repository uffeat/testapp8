/*
import { Anvil } from "@/rolloanvil/anvil.js";
const { Anvil } = await use("@/rolloanvil/anvil.js");
20250703
v.1.3
*/
import "@/rolloanvil/assets/main.css";

import { meta } from "@/rollometa/meta.js";
import { author } from "@/rollocomponent/tools/author.js";
import { base } from "@/rollocomponent/tools/base.js";
import { origins } from "@/rolloanvil/origins.js";
import server from "@/rolloanvil/mixins/server.js";
import worker from "@/rolloanvil/mixins/worker.js";

const cls = class extends base("iframe", worker, server) {
  static __key__ = "rollo-anvil";

  #_ = {};

  constructor() {
    super();
    /* 'origin' is used for 
    - construction of endpoint base url
    - iframe src. */
    this.#_.origin =
      meta.env.name === "production" ? origins.production : origins.development;
  }

  __new__() {
    super.__new__?.();
    this.attribute.origin = this.origin;
  }

  /* Returns env-adjusted origin of companion Anvil app. */
  get origin() {
    return this.#_.origin;
  }
};

/* Returns component instance from which 
- server endpoint calls can be made.
- "client endpoint" calls can be made. These are endpoint-like callables that 
  reside in the companion Anvil app's client code and can be used as a 
  Python-based worker with full access to DOM apis.
- "channels" can be setup. */
export const Anvil = author(cls);
