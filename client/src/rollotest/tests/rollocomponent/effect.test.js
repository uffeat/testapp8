const { component } = await use("@/rollocomponent/");

/* Using host + effect to wire up state-driven reactivity */
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
        effect: function (change) {
          this.text = change.text;
        },
      },
      "Ding"
    )
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
