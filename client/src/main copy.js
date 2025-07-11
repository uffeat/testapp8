import "@/rollotest/__init__.js";

document.querySelector("html").dataset.bsTheme = "dark";

console.info("Environment:", meta.env.name);

import { AnvilWorker, worker } from "@/rolloanvil/worker.js";

await worker.connect({
  assets: "ASSETS",
  channels: {
    foo: (data) => {
      console.log("foo channel got data:", data);
    },
    ding: (data) => {
      console.log("ding channel got data:", data);

      return "Result from ding";
    },
  },
});

await (async () => {
  const response = await worker.api.echo({ number: 42 });
  console.log("echo response:", response);
})();

await (async () => {
  const response = await worker.api.echo({ number: 42 });
  console.log("echo response:", response);
})();

await (async () => {
  const response = await worker.api.bar();
  console.log("bar response:", response);
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
