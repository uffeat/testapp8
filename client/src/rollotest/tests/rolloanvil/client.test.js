/*
rolloanvil/client
*/

const { anvil } = await use("@/rolloanvil/");

anvil.channels.add("foo", (data) => {
  console.log("foo channel got data:", data);
});

await (async () => {
  const response = await anvil.client.echo({ number: 42 });
  console.log("client response:", response);
})();

await (async () => {
  const response = await anvil.client.echo({ number: 42 });
  console.log("client response:", response);
})();

await (async () => {
  const response = await anvil.client.foo("To foo");
  console.log("client response:", response);
})();

await (async () => {
  const response = await anvil.client.foo("To foo");
  console.log("client response:", response);
})();
