import { anvil } from "@/rolloanvil/anvil.js";
await use("@/rollotest/");

document.querySelector("html").dataset.bsTheme = "dark";

console.info(
  "Environment:",
  import.meta.env.DEV ? "development" : import.meta.env.VERCEL_ENV
);

const { component } = await use("@/rollocomponent/");



/* Test */
(async () => {
const response = await anvil.client.foo({ number: 42 });
console.log("client response:", response);
})();

/* Test */
(async () => {
const response = await anvil.server.foo({ number: 42 });
console.log("server response:", response);
})();

