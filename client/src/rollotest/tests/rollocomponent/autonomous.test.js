/*
rollocomponent/autonomous
*/

import { component } from "@/rollocomponent/component.js";

const MyComponent =
  await /* Simulate component-specific module, e.g., inside src/components */
  (async function vmodule() {
    const { Slot, TreeBase, author, component } = await use(
      "@/rollocomponent/"
    );

    return author(
      class extends TreeBase {
        static tag = "my-component";
        static tree = (state) => {
          return [
            component.h1(
              {},
              "Yo World!",
              component.span("text-sm.text-orange-500", {
                ".foo":
                  /* Make 'foo' CSS class reactive and set inital value */
                  function () {
                    state.effects.add(
                      (change) => this.classes.if(change.foo, "foo"),
                      "foo"
                    );
                    return false;
                  },
                "[foo":
                  /* Make 'foo' attribute reactive and set inital value */
                  function () {
                    state.effects.add(
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
                    state.effects.add(
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
  component.h3({}, "Injected into default")
);

my_component.state.$.text = "Hijacked!";