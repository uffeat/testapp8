/*
rollocomponent/setup
*/

import { component } from "@/rollocomponent/component.js";

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
        __setup__: function (host) {
          /* Optional, but fater to use the passed in 'host' */
          host.state.effects.add((change) => {
            if (change.text) {
              host.components.ding.style.color = "pink";
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
      __setup__: function () {
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


