/* tests */
use("@/rollotest/");

const { component } = await use("@/rollocomponent/");

component.h1({ parent: app }, "On a roll!");


const { worker } = await use("@/rolloanvil/");
await worker.connect({receivers: [
  (signal) => console.log('Receiver got signal:', signal.data)
]})

await (async () => {
  
  worker.api.echo({echo: 'Oh, my echo!'}).then((result) => console.log('Result:', result))
})();



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
