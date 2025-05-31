/*
const { MyComponent } = await use("@/rollobs/components/my_component/");
*/

const { registry } = await use("@/rollobs/registry.js");

const { component } = await use("@/rollocomponent/");

await use("/rollobs/components/my_component/assets/main.css");

export const MyComponent = registry.add(
  {
    tag: import.meta,
    /* Define tree function */
    tree: () =>
      component.h1(
        {},
        "Hi! ",
        component.span({
          /* Define reactivity */
          effect: function (change) {
            this.text = change.text;
          },
          /* Provide key for access, when defining reactivity */
          key: "foo",
        })
      ),

    
  },
  /* Mixins go here; directly of from import */
  (parent, config) => {
    return class extends parent {
      __new__(tree) {
        
        /* Share tree with mixins */
        super.__new__?.(tree);
      }
      /* Other class stuff goes here */
    };
  }
);
