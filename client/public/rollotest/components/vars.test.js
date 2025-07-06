/*
component/vars
*/


const connected = component.h1({
  parent: document.body,
  text: "FOO",
  __height: "100%",
  __color: "hotpink",
});

console.log(connected);
console.log(connected.__.color);
console.log(connected.__.height);

connected.vars.foo = "pink !important";
console.log(connected.__.foo);
console.log(connected.__.bar);


const unconnected = component.h1({
  text: "FOO",
  __height: "100%",
  __color: "hotpink",
});

console.log(unconnected);
console.log(unconnected.__.color);
console.log(unconnected.__.height);

unconnected.__.foo = "pink !important";
console.log(unconnected.__.foo);
console.log(unconnected.__.bar);
