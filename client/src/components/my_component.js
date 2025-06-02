import { author } from "@/rollocomponent/tools/author.js";
import { Component, component } from "@/rollocomponent/__init__.js";
import { State } from "@/rollocomponent/tools/state.js";
import { compose } from "@/rollocomponent/tools/compose.js";

await use("/sheets/my_component.css");

export const MyComponent = author(
  "MyComponent",
  class extends compose("tree") {
    static tree = (() => {
      const state = new State();

      const main = Component(
        {},
        component.h1({}, "Yo World!"),
        component.span({
          ".foo": function () {
            state.effects.add(
              (change) => this.classes.if(change.foo, "foo"),
              "foo"
            );
            return false;
          },

          "[foo": function () {
            state.effects.add(
              (change) => (this.attribute.foo = change.foo),
              "foo"
            );
            return null;
          },
          text: function () {
            state.effects.add((change) => (this.text = change.text), "text");
            return "Ding";
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
        )
      );

      return () => main;
    })();
  }
);
