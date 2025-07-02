const { anvil } = await use("@/rolloanvil/");

await anvil.connect();

anvil.channels.add("foo", (data) => {
  console.log("foo channel got data:", data);
});

anvil.client.foo({ foo: true });

await (async () => {
  const response = await anvil.server.echo({ number: 42 }, { timeout: 5000 });
  console.log("server response:", response);
})();

await (async () => {
  const response = await anvil.client.echo({ number: 42 }, { timeout: 800 });
  console.log("client response:", response);
})();
