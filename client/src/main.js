import "@/rollotest/__init__.js";



import { server } from "@/rolloanvil/rolloanvil.js";
const {component} = await use('@/rollocomponent/')

server.echo({echo: 'Oh, my echo!'}).then((result) => {
  
  component.h1({parent: app}, result.data.echo)
})


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

