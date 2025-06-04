/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

console.info("Vite environment:", import.meta.env.MODE);

import { component } from "@/rollocomponent/component.js";
import { Slot } from "@/rollocomponent/slot.js";

const tree = (state) => {
  return () => ({
    state,
    tree: [
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
              state.effects.add((change) => (this.text = change.text), key);
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
    ],
  });
};

/* TODO From tree: Inject Tree and State, register component and get factory */
