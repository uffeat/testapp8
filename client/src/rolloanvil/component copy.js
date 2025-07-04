/*
import { AnvilComponent } from "@/rolloanvil/component.js";
const { AnvilComponent } = await use("@/rolloanvil/component.js");
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
    const owner = this;

    this.#_.origin =
      import.meta.env.VERCEL_ENV === "production"
        ? config.origins.production
        : config.origins.development;
  }

 

  __new__() {
    super.__new__?.();
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

  anvil(data) {
    if (data === undefined && this.#_.data !== undefined) {
      data = this.#_.data;
    }
    this.#_.data = data;
    return this.client.update(data);
  }
};

export const AnvilComponent = author(cls);
