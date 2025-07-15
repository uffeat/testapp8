/*

*/

const { meta } = await use("/meta.js");
const { author, base, component } = await use("/rollocomponent/");

const App = author(
  class extends base() {
    static __key__ = "rollo-app";

    #_ = {};

    constructor() {
      super();

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
  }
);

export const app = App({ id: "app", parent: document.body });

Object.defineProperty(window, "app", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: app,
});
await app.shadow.sheets.import("/rolloapp/assets/shadow");
await use("/rolloapp/assets/main.css");

