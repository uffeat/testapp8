/*
rolloanvil/siblings
*/

const { Anvil } = await use("@/rolloanvil/");

const custom = Anvil({ slot: "data", parent: app });
const custom_2 = Anvil({ slot: "data", parent: app });

custom.channels.add("foo", (data) => {
  console.log("custom foo channel got data:", data);
});

await custom.connect();
await custom_2.connect();

console.log("setup", anvil.setup);

await (async () => {
  const response = await custom.worker.echo({ ding: "DING" });
  console.log("client response from custom:", response);
})();

await (async () => {
  const response = await custom_2.worker.echo({ dong: "DONG" });
  console.log("client response from custom_2:", response);
})();


await (async () => {
  const response = await anvil.worker.echo({ number: 8 });
  console.log("client response:", response);
})();


