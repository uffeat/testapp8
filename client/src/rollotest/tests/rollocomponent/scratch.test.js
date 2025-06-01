

const { component } = await use("@/rollocomponent/");



const headline = component
  .h1(
    "foo.bar",
    {
      parent: document.body,
      __height: "100%",
      text: "FOO",
      host: true,
      ".stuff": true,
      __color: "hotpink",
    },
    component.span(
      {
        key: 'span',
        setup: function ({ parent }) {
          console.log("setup got parent:", parent, "for component:", this);
        },
      },
      "...hi!"
    ),
    () => console.log("Hook says hi!")
  )
  .handlers.add({
    click$run: (event) => console.log("Clicked!"),
  })
  .attributes.set({ fooBar: true, dingDong: 42, thing: "THING" });

console.log("span:", headline.find('span'));
console.log("span:", headline.find.span);

console.log("fooBar:", headline.attributes.get("fooBar"));
console.log("fooBar:", headline.attribute.fooBar);

console.log("dingDong:", headline.attributes.get("dingDong"));
console.log("dingDong:", headline.attribute.dingDong);

console.log("thing:", headline.attributes.get("thing"));
console.log("thing:", headline.attribute.thing);

console.log("nogo:", headline.attributes.get("nogo"));
console.log("nogo:", headline.attribute.nogo);

console.log(headline);

const button = component.button(
  "btn.btn-primary",
  {
    parent: document.body,
    "@click": (event) => console.log("Clicked!"),
    "[stuff": "STUFF",
  },
  "Button"
);
button.on.click$once = (event) => console.log("Clicked!");

console.log("entries:", button.attributes.entries());

button.vars.foo = "pink !important";
console.log(button.vars.foo);

console.log(button.vars.bar);
