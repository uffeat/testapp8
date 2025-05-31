/*
const { MyComponent } = await use("@/rollobs/components/my_component/");
*/

const { registry } = await use("@/rollobs/registry.js");
const { component } = await use("@/rollocomponent/");


await use("/rollobs/components/my_component/assets/main.css");

export const MyComponent = registry.add(
  {
    tag: 'MyComponent',
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
          /* Provide key for fast access via 'tree' */
          key: "foo",
        })
      ),
  },
  /* Mixins go here; directly or from import */
  (parent, config) => {
    return class extends parent {
      __new__() {
        super.__new__?.();
        console.log('Just showing off :-)', this.tree.foo)
      }
      /* Other class stuff goes here */
    };
  }
);
