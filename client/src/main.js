await use("@/rollotest/");

document.querySelector("html").dataset.bsTheme = "dark";

console.info(
  "Environment:",
  import.meta.env.DEV ? "development" : import.meta.env.VERCEL_ENV
);

const { component } = await use("@/rollocomponent/");

const { Anvil, anvil } = await use("@/rolloanvil/");



const custom = Anvil({ slot: "data", parent: app });
const custom_2 = Anvil({ slot: "data", parent: app });

custom.channels.add("foo", (data) => {
  console.log("custom foo channel got data:", data);
});



await (async () => {
  const response = await custom.client.echo({ ding: "DING" });
  console.log("client response from custom:", response);
})();

await (async () => {
  const response = await custom_2.client.echo({ dong: "DONG" });
  console.log("client response from custom_2:", response);
})();

await (async () => {
  const response = await anvil.server.echo({ number: 42 }, { timeout: 5000 });
  console.log("server response:", response);
})();











console.log('HERE');

await (async () => {
  const response = await anvil.client.echo({ number: 8 });
  console.log("client response:", response);
})();


