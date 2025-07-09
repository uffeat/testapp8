import "@/rollotest/__init__.js";

document.querySelector("html").dataset.bsTheme = "dark";

console.info("Environment:", meta.env.name);



import { worker } from "@/rolloanvil/worker.js";

//await worker.connect()

worker.channels.add("foo", (data) => {
  console.log("foo channel got data:", data);
});

await (async () => {
  const response = await worker.api.echo({ number: 42 });
  console.log("client response:", response);
})();

await (async () => {
  const response = await worker.api.echo({ number: 42 });
  console.log("client response:", response);
})();

await (async () => {
  const response = await worker.api.foo();
  console.log("client response:", response);
})();

await (async () => {
  const response = await worker.api.bar();
  console.log("client response:", response);
})();