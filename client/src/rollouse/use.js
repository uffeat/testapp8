/*
import { Use } from "@/rollouse/use.js";
*/

import { Imports } from "@/rollouse/tools/imports.js";
import { Path } from "@/rollouse/tools/path.js";
import { Processors } from "@/rollouse/tools/processors.js";
import { Signatures } from "@/rollouse/tools/signatures.js";
import { TypeHooks } from "@/rollouse/tools/type_hooks.js";
import { pub } from "@/rollouse/tools/pub.js";

export const Use = new (class {
  #_ = {};

  constructor() {
    this.#_.processors = new Processors(this);
    this.#_.signatures = new Signatures(this);
    this.#_.imports = new Imports(this);
    this.#_.typeHooks = new TypeHooks(this);
  }

  /* Returns imports controller. */
  get imports() {
    return this.#_.imports;
  }

  /* Returns processors controller. */
  get processors() {
    return this.#_.processors;
  }

  /* Returns signatures controller. */
  get signatures() {
    return this.#_.signatures;
  }

  /* Returns typeHooks controller. */
  get typeHooks() {
    return this.#_.typeHooks;
  }

  async module(specifier, options = {}) {
    const path = new Path(specifier);

    /* Type hooks */
    if (this.typeHooks.has(path.type)) {
      const loader = this.typeHooks.get(path.type);
      return await loader(specifier);
    }

    /* Signature */
    if (this.signatures.has(path.types)) {
      const handler = this.signatures.get(path.types);
      await handler(options, { owner: this, path });
    }
    const { cache = true, raw = false } = options;

    /* Import */
    const result = path.public
      ? await pub.import(path, { cache, raw })
      : await this.imports.import(path, { raw });

    /* Process */
    if (this.processors.has(path.types)) {
      const processor = this.processors.get(path.types);
      const processed = await processor.call(path.path, result, {
        owner: this,
        path,
        cache,
      });
      if (processed !== undefined) return processed;
    }

    return result;
  }
})();
