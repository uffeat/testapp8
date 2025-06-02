import { component } from "@/rollocomponent/component.js";

/* Using host + keys + hooks to wire up state-driven reactivity */
const container = component.div(
  {
    parent: document.body,
    host: true,
    state: true,
  },
  component.h1(
    {},
    "Bar ",
    component.span({}, "FOO"),
    () =>
      function () {
        this.host.state.effects.add((change) => {
          console.log("foo hook running...");
          this.host.components.ding.style.backgroundColor = "linen";
        });
      }
  ),
  component.h2(
    {
      key: "ding",
    },
    "Ding",
    /* NOTE If hooks are used to register effects, it's safest to register all 
    effects in one or more top-level hooks. This gives full control of effects orchestration.
    However, this is to demo that local function-returning hooks can also be used.
      */
    () =>
      function () {
        this.host.state.effects.add((change) => {
          console.log("ding hook running...");
          this.style.color = "pink";
        });
      }
  ),
  component.button(
    "btn.btn-primary",
    {
      "@click": function (event) {
        this.host.state.update({ text: "Dong" });
      },
    },
    "Go Dong"
  ),
  function () {
    this.state.effects.add((change) => {
      console.log("container hook running...");
      this.components.ding.text = change.text;
    });
  }
);
