import { anvil } from "@/rolloanvil/anvil.js";
await use("@/rollotest/");

document.querySelector("html").dataset.bsTheme = "dark";

console.info(
  "Environment:",
  import.meta.env.DEV ? "development" : import.meta.env.VERCEL_ENV
);

const { component } = await use("@/rollocomponent/");

/* Test */
anvil.server
  .echo({ number: 42 })
  .then((response) => console.log("server response:", response));

anvil.client
  .echo({ number: 42 })
  .then((response) => console.log("client response:", response));

  anvil.client
  .echo({ number: 42 })
  .then((response) => {
    console.log("client submission:", anvil.client.submission);
    console.log("client response:", response)
  });


   