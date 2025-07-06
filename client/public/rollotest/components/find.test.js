/*
component/find
*/


const headline = component.h1(
  "foo.bar",
  {
    parent: document.body,

    text: "FOO",
  },
  component.span({}, "...hi!")
);

console.log("span:", headline.find("span"));

console.log(headline);
