/*
const { MyComponent } = await use("@/rollobs/components/my_component/");
*/

const { registry } = await use("@/rollobs/registry.js");
const { component } = await use("@/rollocomponent/");

await use("/rollobs/components/my_component/assets/main.css");

export const MyComponent = registry.add(
  { tag: "my", tree: () => component.h1({}, "Hi") },
  (parent, config) => {
    return class extends parent {
      __new__(tree) {
        this.append(tree);
        super.__new__?.(tree);
      }
    };
  }
);
