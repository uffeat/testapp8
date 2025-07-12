import "@/rollotest/__init__.js";

document.querySelector("html").dataset.bsTheme = "dark";

console.info("Environment:", meta.env.name);

import { AnvilWorker, worker } from "@/rolloanvil/worker.js";

await worker.connect({config: {message: 'Message from config'}});

console.log('setup:', worker.setup)
console.log('config:', worker.config)



worker.receiver.add((message) => {
  console.log('Got signal data:', message.data)
  return true

})


await (async () => {
  const response = await worker.api.bar();
  console.log("bar response:", response);
})();

await (async () => {
  const response = await worker.api.foo();
  console.log("foo response:", response);
})();

await (async () => {
  const response = await worker.api.foo();
  console.log("foo response:", response);
})();



/*
const custom = AnvilWorker({ parent: app });
await custom.connect();

await (async () => {
  const response = await custom.api.echo({ custom: 42 });
  console.log("custom echo response:", response);
})();
*/

//worker.api.nodice()
