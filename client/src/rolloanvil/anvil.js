/*
import { anvil } from "@/rolloanvil/anvil.js";
const { anvil } = await use("@/rolloanvil/anvil.js");
*/

import "@/rolloanvil/assets/main.css";

import { author } from "@/rollocomponent/tools/author.js";
import { base } from "@/rollocomponent/tools/base.js";

import config from "@/rolloanvil/config.json";

import channels from "@/rolloanvil/mixins/channels.js";
import client from "@/rolloanvil/mixins/client.js";
import server from "@/rolloanvil/mixins/server.js";

const cls = class extends base("iframe", channels, client, server) {
  static __key__ = "rollo-anvil";

  #_ = {};

  constructor() {
    super();

    this.#_.origin =
      import.meta.env.VERCEL_ENV === "production"
        ? config.origins.production
        : config.origins.development;

    super.src = this.#_.origin;
  }

  __new__() {
    super.__new__?.();
    this.attribute[this.constructor.__key__] = true;
  }

  /* Returns channels controller. */
  get channels() {
    return this.#_.channels;
  }

  get origin() {
    return this.#_.origin;
  }

  __init__() {
    super.__init__?.();
  }
};

const factory = author(cls);

export const anvil = factory({ slot: "data", parent: app });
