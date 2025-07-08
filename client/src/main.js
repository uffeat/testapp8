import "@/rollotest/__init__.js";

document.querySelector("html").dataset.bsTheme = "dark";

console.info("Environment:", meta.env.name);


import { anvil } from "@/rolloanvil/__init__.js";


anvil.channels.add("foo", (data) => {
  console.log("foo channel got data:", data);
});

await (async () => {
  const response = await anvil.worker.echo({ number: 42 });
  console.log("client response:", response);
})();