/*
rollovite/use/link
*/

const { component } = await use("@/rollo/component/component.js");






component.h1("foo.bar", { parent: document.body }, "FOO");
await use("/test/bar/bar.css");


