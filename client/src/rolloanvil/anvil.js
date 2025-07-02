/*
import { anvil } from "@/rolloanvil/anvil.js";
const { anvil } = await use("@/rolloanvil/anvil.js");
*/

import { author } from "@/rollocomponent/tools/author.js";
import { base } from "@/rollocomponent/tools/base.js";

import config from "@/rolloanvil/config.json";

import channels from "@/rolloanvil/mixins/channels.js";
import client from "@/rolloanvil/mixins/client.js";
import server from "@/rolloanvil/mixins/server.js";

const cls = class extends base("iframe", channels, client, server) {
  static __key__ = "data-anvil";

  #_ = {};

  constructor() {
    super();
    /* 'origin' is used for 
    - construction of endpoint base url
    - iframe src. */
    this.#_.origin = this.src =
      import.meta.env.VERCEL_ENV === "production"
        ? config.origins.production
        : config.origins.development;
  }

  /* Returns env-adjusted origin of companion Anvil app. */
  get origin() {
    return this.#_.origin;
  }
};

/* NOTE Typically, the component should be used as a singleton, but multiple 
instances can be created. */
export const Anvil = author(cls);

/* Component instance, from which 
- server endpoint calls can be made.
- "client endpoint" calls can be made. These are endpoint-like callables that 
  reside in the companion Anvil app's client code and can be used as a 
  Python-based worker with full access to DOM apis. */
export const anvil = Anvil({ slot: "data", parent: app });

/* NOTE The 'data' slot of the 'app' component is reserved for non-vidual components. */
