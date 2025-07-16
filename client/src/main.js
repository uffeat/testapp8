//import "@/rollotest/__init__.js";

const { component } = await use("@/rollocomponent/");

component.h1({ parent: app }, 'On a roll!')

await (async () => {
  const Input = await use("/components/form/input.x.html");

  const uffe = Input({
    parent: app,
    name: "uffe",
    //value: 'uff',
    required: true,
    validators: [
      (value) => {
        if (value !== "uffe") {
          return "Not uffe";
        }
      },
    ],
  });
})();


const { server } = await use("@/rolloanvil/");
server.echo({ echo: "Oh, my echo!" }).then((result) => {
  console.log(result);
  component.h1({ parent: app }, result.data.echo);
});


/*
const { Receivers } = await use("/rolloanvil/receivers.js");
Receivers.add((data) => {
  console.log('Receiver got signal:', data)
})
  */

/*
const foo = await use("foo.py");
foo().then((result) => console.log(result));

const echo = await use("echo.py");
echo({ echo: "echo!echo" }).then((result) => console.log(result));
*/
