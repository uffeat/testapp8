/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

console.info("Vite environment:", import.meta.env.MODE);



const { Slot, author, component, mix, mixins } = await use(
  "@/rollocomponent/"
);

class Tree extends mix(
  HTMLElement,
  {},
  
  mixins.attrs,
  mixins.classes,
  mixins.clear,
  mixins.components,
  mixins.connect,
  mixins.find,
  mixins.handlers,
  mixins.hooks,
  mixins.host,
  mixins.key,
  mixins.parent,
  mixins.props,
  mixins.send,
  mixins.slots,
  mixins.state,
  mixins.style,
  mixins.tab,
  mixins.text,
  mixins.vars,
  mixins.super_,


) {
  constructor() {
    super();
  }
}

const cls = class extends Tree {
  static __tag__ = "my-component";

  static __new__ = function () {
    this.state = true;
     const host = this;
    const state = this.state;

    const tree = [
      component.h1(
        {},
        "Yo World!",
        component.span("text-sm.text-orange-500", {
          ".foo":
            /* Make 'foo' CSS class reactive and set inital value */
            function () {
              host.state.effects.add(
                (change) => this.classes.if(change.foo, "foo"),
                "foo"
              );
              return false;
            },
          "[foo":
            /* Make 'foo' attribute reactive and set inital value */
            function () {
              host.state.effects.add(
                (change) => (this.attribute.foo = change.foo),
                "foo"
              );
              return null;
            },
          text:
            /* Make text prop reactive and set inital value */
            function (key) {
              /* state-component key parity -> we can use the passed in key
              as effect condition */
              host.state.effects.add((change) => (this.text = change.text), key);
              return "Ding";
            },
        })
      ),
      Slot({ name: "top" }),
      component.input("form-control"),
      Slot({
        name: "main",
        "@slotchange": function (event) {
          console.log("Slot change!");
        },
      }),
      component.button(
        "btn.btn-primary",
        {
          "@click": function (event) {
            state.update({ text: "Dong" });
          },
        },
        "Go Dong"
      ),
      component.button(
        "btn.btn-primary",
        {
          "@click": function (event) {
            state.$.foo = "FOO";
          },
        },
        "Go Foo"
      ),
    ];

    this.append(...tree);
  };

  get value() {
    return this.find("input").value;
  }

  set value(value) {
    this.find("input").value = value;
  }
};

const MyComponent = author(cls);

/* Consuming code. */
const my_component = MyComponent(
  { parent: document.body, value: 42 },
  component.h3({ slot: "top" }, "Injected into top"),
  component.h3({slot: "main"}, "Injected into main")
);

my_component.state.$.text = "Hijacked!";

