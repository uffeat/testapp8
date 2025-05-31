/* 
const { registry } = await use("@/rollobs/registry.js");
v.1.0
20250530
*/

const { Args } = await use("@/rollocomponent/tools/args.js");
const { mix } = await use("@/rollocomponent/tools/mix.js");

const { mixins: _mixins } = await use("@/rollocomponent/mixins/");

const { define } = await use("@/rollobs/tools/define.js");

const { shadow } = await use("@/rollobs/mixins/shadow.js");
const { state } = await use("@/rollobs/mixins/state.js");
const { tree: _tree } = await use("@/rollobs/mixins/tree.js");

export const registry = new (class {
  /* Registers autonomous web component from mixins and returns component 
  factory.
  - Adds standard mixins.
  - Injects tree.
  - Sets up reactivity.
  - Intended for ligt-DOM-first components. However, to accommodate special 
    cases and for alternative uses, a shadow root is attached. */
  add({ config = {}, tag, tree }, ...mixins) {
    mixins.push(shadow, state, _tree, ..._mixins);

    const cls = mix(HTMLElement, config, ...mixins);

    define(tag, cls);

    return factory(cls, tree);
  }
})();

/* Returns component factory function. */
function factory(cls, tree) {
  return (...args) => {
    const instance = new cls();

    if (tree) {
      /* Set up tree  */

      instance.tree.setup(tree());
    }

    /* Parse args */
    args = new Args(args);

    /* Add CSS classes */
    instance.classes.add(args.classes);

    /* Use updates */
    instance.update(args.updates);

    /* Append children */
    instance.append(...args.children);

    /* Set up child elements */
    args.children.forEach((child) => {
      if (child instanceof Node) {
        child.setup?.({ parent: instance });
      }
    });

    /* Call '__new__' to do stuff not allowed in constructors.
    NOTE Done late to provide max info */
    instance.__new__?.();
    /* '__new__' is for factory use only, so remove */
    delete instance.__new__;

    return instance.hooks(...args.hooks);
  };
}
