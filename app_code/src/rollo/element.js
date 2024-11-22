/* Uility for authoring and creating web components and component functions. */
export const element = new (class {
  get registry() {
    return this.#registry;
  }
  #registry = new (class Registry {
    #registry = {};
    /*  */
    add = (c, tag) => {
      if (tag) {
        if (tag.includes("-")) {
          customElements.define(tag, c);
          console.info(
            `Registered autonomous web component with tag '${tag}'.`
          );
        } else {
          customElements.define(`native-${tag}`, c, {
            extends: tag,
          });
          console.info(
            `Registered non-autonomous web component extended from '${tag}'.`
          );
        }
        this.#registry[tag] = c;
        return c;
      } else {
        tag = c.name;
        if (!c) {
          throw new Error(`Component functions must have a name.`);
        }
        if (tag === tag.toLowerCase()) {
          throw new Error(
            `Component function names should should contain one or more upper-case letters; '${tag}' does not.`
          );
        }
        if (tag in this.#registry) {
          throw new Error(`A component with tag '${tag}' already registered.`);
        }
        console.info(`Registered function component with tag '${tag}'.`);
        const func = function (...args) {
          const component = c(...args);
          component.dataset.constructorName = c.name;
          return component;
        };
        this.#registry[tag] = func;
        return func;
      }
    };
    /*  */
    get = (tag) => {
      return this.#registry[tag];
    };
  })();

  get factories() {
    return this.#factories;
  }
  #factories = new (class Factories {
    #registry = [];
    /* Registers conditional web component class factory */
    add = (factory, condition) => {
      this.#registry.push([factory, condition]);
    };
    /* Returns factories relevant for a given tag */
    get = (tag) => {
      return this.#registry
        .filter(([factory, condition]) => !condition || condition(tag))
        .map(([factory, condition]) => factory);
    };
  })();

  

  /* Returns instance of web component  */
  create = (arg = null, updates = {}, ...children) => {
    let tag = "div";
    let css_classes;
    if (arg) {
      /* Extract tag and css_classes from arg */
      const arg_parts = arg.split(".");
      tag = arg_parts.shift();
      css_classes = arg_parts;
    }
    let element;
    if (tag === tag.toLowerCase()) {
      element = new (this.get(tag))(updates, ...children);
    } else {
      element = this.get(tag)(updates, ...children);
    }
    /* Add css classes */
    if (css_classes && css_classes.length > 0) {
      /* NOTE Condition avoids adding empty class attr */
      element.classList.add(...css_classes);
    }
    element.update(updates);
    for (const child of children) {
      if (typeof child === "function") {
        const result = child.call(element);
        if (result === undefined) {
          continue;
        }
        if (Array.isArray(result)) {
          element.append(...result);
        } else {
          element.append(result);
        }
        continue;
      }
      element.append(child);
    }
    return element;
  };

  
})();

export const create = component.create;

