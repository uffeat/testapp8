//await use("@/rollotest/");

document.querySelector("html").dataset.bsTheme = "dark";

console.info("Environment:", app.meta.env.name);

const { anvil } = await use("@/rolloanvil/");
//import { Anvil } from "@/rolloanvil/anvil.js";
//const anvil = Anvil({parent: app, slot: 'data'})

await (async () => {
  const data = {
    email: "name@company.com",
    score: 8,
    accept: true,
    bar: null,
    stuff: false,
  };

  const result = await anvil.server.foo(data);
  console.log("result:", result);

  const raw = await anvil.server.foo(data, { raw: true });
  console.log("raw:", raw);
})();
