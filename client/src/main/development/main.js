/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

console.info("Vite environment:", import.meta.env.MODE);

import { Args } from "@/rollocomponent/tools/args.js";
import { mixins } from "@/rollocomponent/mixins/__init__.js";
import { mix } from "@/rollocomponent/tools/mix.js";
import { define } from "@/rollocomponent/tools/define.js";
import shadow from "@/rollocomponent/mixins/shadow.js";
import { component } from "@/rollocomponent/__init__.js";

const tree = (parent, config) => {
  return class extends parent {
    #_ = {};

    __new__() {
      super.__new__?.();

      if (this.constructor.tree) {
        const tree = this.constructor.tree();
        if (Array.isArray(tree)) {
          this.append(...tree);
        } else {
          this.append(tree);
        }
      }
    }
  };
};

const composition = mix(HTMLElement, {}, tree, shadow, ...mixins);

/* TODO Aggregate mix, define, tree, and factory into abstraction */
const cls = class extends composition {
  static tree = () => component.h1({}, "Yo World!");
};

define("MyComponent", cls);

/* TODO Use this exact same factory for basic components also */
const factory = (cls) => {
  self = new cls();
  return (...args) => {
    /* Parse args */
    args = new Args(args);
    /* Add CSS classes */
    self.classes.add(args.classes);
    /* Use updates */
    self.update(args.updates);
    /* Append children */
    self.append(...args.children);
    /* Call '__new__' to do stuff not allowed in constructors. */
    self.__new__?.();
    /* '__new__' is for factory use only, so remove */
    delete self.__new__;
    /* Call hooks and return instance */
    return self.hooks(...args.hooks);
  };
};

const MyComponent = factory(cls);

const my_component = MyComponent({ parent: document.body });
