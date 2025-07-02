await use("@/rollotest/");

document.querySelector("html").dataset.bsTheme = "dark";

console.info(
  "Environment:",
  import.meta.env.DEV ? "development" : import.meta.env.VERCEL_ENV
);

const { component } = await use("@/rollocomponent/");

const { anvil } = await use("@/rolloanvil/");





anvil.channels.add("foo", (data) => {
  console.log("foo channel got data:", data);
});

anvil.client.foo({'.foo': true})



await (async () => {
  //const response = await anvil.server.echo({ number: 42 }, { timeout: 5000 });
  //console.log("server response:", response);
})();

await (async () => {
  const response = await anvil.client.echo({ number: 42 }, { timeout: 800 });
  console.log("client response:", response);
})();




