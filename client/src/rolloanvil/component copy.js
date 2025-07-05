/*
import { AnvilComponent } from "@/rolloanvil/component.js";
const { AnvilComponent } = await use("@/rolloanvil/component.js");
20250703
v.1.3
*/

import "@/rolloanvil/assets/main.css";

import { author } from "@/rollocomponent/tools/author.js";
import { base } from "@/rollocomponent/tools/base.js";

import config from "@/rolloanvil/config.json";

import client from "@/rolloanvil/mixins/client.js";

const cls = class extends base("iframe", client) {
  static __key__ = "anvil-component";

  #_ = {};

  constructor() {
    super();

    this.#_.origin =
      import.meta.env.VERCEL_ENV === "production"
        ? config.origins.production
        : config.origins.development;
  }

  /* Returns component controller. */
  get component() {
    return this.client;
  }

  /* Returns env-adjusted origin of companion Anvil app. */
  get origin() {
    return this.#_.origin;
  }

  /* Returns src. */
  get src() {
    return super.src;
  }

  /* Set src from path fragment. */
  set src(path) {
    super.src = `${this.origin}/${path}`;
  }
};

export const AnvilComponent = author(cls);
