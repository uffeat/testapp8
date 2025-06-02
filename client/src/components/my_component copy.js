import { author } from "@/rollocomponent/tools/author.js";
import { Component, component } from "@/rollocomponent/__init__.js";
import { State } from "@/rollocomponent/tools/state.js";
import { compose } from "@/rollocomponent/tools/compose.js";

await use("/sheets/my_component.css");

export const MyComponent = author(
  "MyComponent",
  class extends compose("tree") {
    /* NOTE iife to encapsulate state */
    static tree = (() => {
      const state = new State();

      /* 'Component' is an autonomous web component with same features as 
      basic Rollo components.  */
      const main = Component(
        /* NOTE Typically, state should not be added to a tree component, 
        but doing so enables external state-based updates, which may be desirable. */
        {state},
        component.h1({}, "Yo World!"),
        component.span({
          ".foo": function () {
            /* Make 'foo' CSS class depend on Boolean interpretation of state.$.foo */
            state.effects.add(
              /* Effect is only triggered, when change contains a 'foo' key. */
              (change) => this.classes.if(change.foo, "foo"),
              "foo"
            );
            /* Intially, no 'foo' CSS class */
            return false;
          },

          "[foo": function () {
            /* Make 'foo' attribute depend on state.$.foo */
            state.effects.add(
              /* Effect is only triggered, when change contains a 'foo' key. */
              (change) => (this.attribute.foo = change.foo),
              "foo"
            );
            /* Intially, no 'foo' attribute */
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
