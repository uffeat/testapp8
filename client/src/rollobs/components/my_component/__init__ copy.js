/*
const { MyComponent } = await use("@/rollobs/components/my_component/");
*/

const { registry } = await use("@/rollobs/registry.js");
const { Fragment } = await use("@/rollobs/tools/fragment.js");
const { component } = await use("@/rollocomponent/");

await use("/rollobs/components/my_component/assets/main.css");

export const MyComponent = registry.add(
  {
    tag: import.meta,
    /* Define tree function */
    tree: () =>
      Fragment(
        component.h1(
          {},
          "Hi! ",
          component.span({
            /* Provide key for access, when defining reactivity */
            key: "foo",
          })
        )
      ),

    /* Define reactivity */
    effects: {
      foo: function (change) {
        this.text = change.text;
      },
    },
  },
  /* Mixins go here; directly of from import */
  (parent, config) => {
    return class extends parent {
      __new__(tree) {
        /* Add tree (result of tree function; called in registry) */
        this.append(tree);
        /* Share tree with mixins */
        super.__new__?.(tree);
      }
      /* Other class stuff goes here */
    };
  }
);
