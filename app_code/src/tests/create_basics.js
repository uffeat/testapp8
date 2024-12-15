// create_basics

await (async () => {
  const { create } = await import("rollo/component");
 

  if (!root) {
    create("div", {
      id: "root",
      parent: document.body,
    });
  }

  const button = create(
    "button",
    {
      parent: root,
      $$text: "Hello World",
      attribute_foo: "FOO",
      ".btn": true,
      on_click: (event) => {
        console.log("Clicked");
      },
    },
    ".btn-primary",
    function () {
      this.effects.add((data) => {
        console.log("$text:", this.$.$text);
      }, "$text");
    }
  );

  button.$.$text = "Yo world";
//button.$['$.btn-primary'] = true
})();
