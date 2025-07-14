import "@/rollotest/__init__.js";

document.querySelector("html").dataset.bsTheme = "dark";

console.info("Environment:", meta.env.name);

const { Receivers } = await use("/rolloanvil/receivers.js");


Receivers.add((data) => {
  console.log('Receiver got signal:', data)
})


const foo = await use("foo.py");
foo().then((result) => console.log(result));

const echo = await use("echo.py");
echo({ echo: "echo!echo" }).then((result) => console.log(result));


