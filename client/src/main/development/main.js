/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

console.info("Vite environment:", import.meta.env.MODE);

import { component } from "@/rollocomponent/component.js";

const MyComponent =
  await /* Simulate component-specific module, e.g., inside src/components */
  (async function vmodule() {
    const { Slot, Tree, author, component } = await use("@/rollocomponent/");

    return author(
      class extends Tree {
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
                    host.state.effects.add(
                      (change) => (this.text = change.text),
                      key
                    );
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
      }
    );
  })();

/* Consuming code. */
const my_component = MyComponent(
  { parent: document.body, value: 42 },
  component.h3({ slot: "top" }, "Injected into top"),
  component.h3({ slot: "main" }, "Injected into main")
);

my_component.state.$.text = "Hijacked!";


console.log('meta:', my_component.constructor.__meta__)
console.log('base:', my_component.constructor.__meta__.base)
console.log('classes:', Array.from(my_component.constructor.__meta__.classes()))


console.log(HTMLElement.name)
console.log(Object.hasOwn(HTMLElement, 'name'))