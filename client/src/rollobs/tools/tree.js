/*
const { Tree } = await use("@/rollobs/tools/tree.js");
20250531
v.1.1
*/

const { mix } = await use("@/rollocomponent/tools/mix.js");
const { define } = await use("@/rollobs/tools/define.js");

export const Tree = define(
  "Tree",
  mix(HTMLElement, {}, (parent, config) => {
    return class extends parent {
      #_ = {};
      constructor(owner) {
        super();
        this.#_.owner = owner;
      }

      /* Appends components and adds key-components as accessor props. Chainable. */
      setup(...components) {
        this.append(...components);
        /* Register key-components as accessor props */
        this.querySelectorAll("[key]")
          .values()
          .forEach((component) =>
            Object.defineProperty(this, component.key, {
              configurable: true,
              enumerable: true,
              writable: true,
              value: component,
            })
          );

        /* Set up reactivity */
        this.querySelectorAll(`[effect]`)
          .values()
          .forEach((component) =>
            this.#_.owner.state.effects.add(component.effect.bind(component))
          );

        this.#_.owner.append(this);

        return this;
      }
    };
  })
);

/* NOTE 
- The component is composed. This is, strictly speaking not necessary, since 
  only a single mixin is used. However, the mix pattern makes it easy to add 
  additional mixin with only minimal changes.
 */
