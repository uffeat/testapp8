import "@/rollotest/__init__.js";

document.querySelector("html").dataset.bsTheme = "dark";

console.info("Environment:", meta.env.name);



import { worker } from "@/rolloanvil/worker.js";



worker.channels.add("foo", (data) => {
  console.log("foo channel got data:", data);
});

await (async () => {
  const response = await worker.worker.echo({ number: 42 });
  console.log("client response:", response);
})();