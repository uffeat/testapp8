
/* Would normally reside in actual component-specific module, e.g., inside src/components */
const MyComponent = await (async function vmodule() {
  const { Slot, State, Tree, author, component, compose } = await use(
    "@/rollocomponent/"
  );

  await use("/sheets/my_component.css");

  const MyComponent = author(
    "MyComponent",
    class extends compose("tree") {
      /* NOTE iife to encapsulate state */
      static tree = (() => {
        const state = new State();

        return () =>
          Tree(
            /* NOTE Typically, state should not be added to the tree component, 
            but doing so enables external state-based updates, which may be desirable. */
            { state },
            component.h1(
              {},
              "Yo World!",
              component.span("text-sm.text-orange-500", {
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
                /* Make text content depend on state.$.text */
                text: function (key) {
                  /* Effect is only triggered, when change contains a 'text' key.
                  Because there is state-component key parity, we can use the passed in key */
                  state.effects.add((change) => (this.text = change.text), key);
                  /* Set initial text */
                  return "Ding";
                },
              })
            ),
            component.input("form-control"),
            Slot({ name: "main" }),
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
      })();

      get value() {
        return this.tree.find("input").value
      }

      set value(value) {
        this.tree.find("input").value = value;
      }
    }
  );

  return MyComponent;
})();

/* Here's the consuming code that would normally reside elsewhere in the app - 
perhaps inside another component module. */
import { component } from "@/rollocomponent/component.js";
const my_component = MyComponent(
  { parent: document.body, value: 42 },
  component.h3({ slot: "main" }, "Injected")
);
my_component.tree.state.$.text = "Hijacked!";

