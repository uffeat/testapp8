/*

*/

const { meta } = await use("/meta.js");
const { author, base, component } = await use("/rollocomponent/");
const { Path } = await use("/rolloapp/tools/path.js");
const { Processors } = await use("/rolloapp/tools/processors.js");
const { Signatures } = await use("/rolloapp/tools/signatures.js");
const { pub } = await use("/rolloapp/tools/pub.js");
const { Imports } = await use("/rolloapp/tools/imports.js");
const { TypeHooks } = await use("/rolloapp/tools/type_hooks.js");

const App = author(
  class extends base() {
    static __key__ = "rollo-app";

    #_ = {};

    constructor() {
      super();

      this.#_.processors = new Processors(this);
      this.#_.signatures = new Signatures(this);
      this.#_.imports = new Imports(this);
      this.#_.typeHooks = new TypeHooks(this);

      this.id = "app";

      this.shadow.append(
        component.div({}, component.slot({ name: "data" })),
        component.div({}, component.slot({ name: "modal" }))
      );
    }

    __new__() {
      super.__new__?.();
      const owner = this;

      this.attribute.dev = meta.env.DEV;
      this.attribute.environment = meta.env.name;
      this.attribute.origin = meta.env.origin;
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

    /* Returns import from src or public, subject to any processing. */
    async import(specifier, options = {}) {
      const path = new Path(specifier);

      /* Type hooks */
      if (this.#_.typeHooks.has(path.type)) {
        const loader = this.#_.typeHooks.get(path.type);
        return await loader(specifier);
      }

      /* Signature */
      if (this.#_.signatures.has(path.types)) {
        const handler = this.#_.signatures.get(path.types);
        await handler(options, { owner: this, path });
      }
      const { cache = true, raw = false } = options;

      /* Import */
      const result = path.public
        ? await pub.import(path, { cache, raw })
        : await this.imports.import(path, { raw });

      /* Process */
      if (this.#_.processors.has(path.types)) {
        const processor = this.#_.processors.get(path.types);
        const processed = await processor.call(path.path, result, {
          owner: this,
          path,
          cache,
        });
        if (processed !== undefined) return processed;
      }
      return result;
    }

    __init__() {
      super.__init__?.();
    }
  }
);

export const app = App({ id: "app", parent: document.body });
