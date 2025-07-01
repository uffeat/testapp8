await use("@/rollotest/");

document.querySelector("html").dataset.bsTheme = "dark";

console.info(
  "Environment:",
  import.meta.env.DEV ? "development" : import.meta.env.VERCEL_ENV
);

const { component } = await use("@/rollocomponent/");

const { anvil } = await use("@/rolloanvil/");

/*
anvil.client.__component__.classes.add('bar')
await anvil.client.__component__.pending


anvil.client({'.foo': true})
*/
anvil.channels.add("foo", (data) => {
  console.log("foo channel got data:", data);
});

await (async () => {
  const response = await anvil.server.echo({ number: 42 }, { timeout: 2000 });
  console.log("server response:", response);
})();

await (async () => {
  const response = await anvil.client.echo({ number: 42 }, { timeout: 800 });
  console.log("client response:", response);
})();

/*
await anvil.client.__component__.pending

console.log('HERE')
*/
