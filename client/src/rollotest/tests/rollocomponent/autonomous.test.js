/* Would normally reside in actual component-specific module, e.g., inside src/components */
const MyComponent = await (async function vmodule() {
  const { WebComponent, State, author, component, compose } = await use(
    "@/rollocomponent/"
  );

  await use("/sheets/my_component.css");

  const MyComponent = author(
    "MyComponent",
    class extends compose("tree") {
      /* NOTE iife to encapsulate state */
      static tree = (() => {
        const state = new State();

        /* 'WebComponent' is an autonomous web component with same features as 
        basic Rollo components; suitable as top-level wrapper although, 
        e.g., component.div could also be used. 
        Tree functions are also alloed to return an array of components. */
        return () =>
          WebComponent(
            /* NOTE Typically, state should not be added to a tree component, 
            but doing so enables external state-based updates, which may be desirable. */
            { state, key: "main" },
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
              /* Make text content depend on state.$.text */
              text: function () {
                /* Effect is only triggered, when change contains a 'text' key. */
                state.effects.add(
                  (change) => (this.text = change.text),
                  "text"
                );
                /* Set initial text */
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
      })();
    }
  );

  return MyComponent;
})();

/* Here's the consuming code that would normally reside elsewhere in the app - perhaps inside another component module. */
const my_component = MyComponent({ parent: document.body });

my_component.components.main.state.$.text = "Hijacked!";
