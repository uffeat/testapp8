const { component } = await use("@/rollocomponent/");


/* Using host + keys + setup to wire up state-driven reactivity */
const container = component.div(
  {
    parent: document.body,
    host: true,
    state: true,
  },
  component.h1(
    {},
    "Bar ",
    component.span(
      {
        /* This is just to show that, although not typical to contol 
        another component from the setup function, it can be done. */
        setup: function () {
          this.host.state.effects.add((change) => {
            if (change.text) {
              this.host.components.ding.style.color = "pink";
            }
          });
        },
      },
      "FOO"
    )
  ),
  component.h2(
    {
      key: "ding",
      setup: function () {
        this.host.state.effects.add((change) => (this.text = change.text));
      },
    },
    "Ding"
  ),
  component.button(
    "btn.btn-primary",
    {
      "@click": function (event) {
        this.host.state.update({ text: "Dong" });
      },
    },
    "Go Dong"
  )
);
