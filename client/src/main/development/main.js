/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

console.info("Vite environment:", import.meta.env.MODE);

const { component } = await use("@/rollocomponent/");

const container = component.div(
  {
    parent: document.body,
    host: true,
    key: 'container',
    state: true,
  },
  component.h1(
    { key: "bar" },
    "Bar ",
    component.span(
      {
        key: "foo",
        setup: function () {
          console.log(`'setup' for key '${this.key}' running...`);
          console.log("host:", this.host);
          console.log("bar:", this.host.components.bar);
          console.log(" ");
        },
      },
      "FOO"
    ),
    function () {
    console.log("bar hook running...");
    console.log(" ");
  }
  ),
  component.h2(
    {
      key: "ding",
      effect: function (change) {this.text = change.text},
      setup: (self) => {
        console.log(`'setup' for key '${self.key}' running...`);
        console.log("host:", self.host);
        console.log("bar:", self.host.components.bar);
        console.log(" ");
      },
    },
    "Ding"
  ),
  component.button('btn.btn-primary',{ '@click': function(event) {
    console.log('Clicked on:', this)
    


    this.host.state.update({text: 'Dong'})
  }}, 'Go Dong'),
  function () {
    console.log("host hook running...");
    console.log(" ");
  }
);

console.log("foo:", container.components.foo);

const factory = component();
//console.log("factory:", factory);//
