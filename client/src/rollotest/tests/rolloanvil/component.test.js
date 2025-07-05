/*
rolloanvil/component
*/
const { AnvilComponent } = await use("@/rolloanvil/component.js");

const plot = AnvilComponent("h-screen", { parent: app, src: "plot" });

await plot.connect();

//console.log("setup", plot.setup);

plot.channels.add("click", (data) => {
  console.log("click channel got data:", data);
});

await (async () => {
  const response = await plot.client.get("data");
  console.log("get response:", response);
})();

await (async () => {
  const response = await plot.client.update({
    data: [
      {
        name: "Europe",
        x: [2019, 2020, 2021, 2022, 2023],
        y: [510, 620, 687, 745, 881],
      },
      {
        name: "America",
        x: [2019, 2020, 2021, 2022, 2023],
        y: [733, 880, 964, 980, 1058],
      },
      {
        name: "Asia",
        x: [2019, 2020, 2021, 2022, 2023],
        y: [662, 728, 794, 814, 906],
      },
    ],
  });
  console.log("update response:", response);
})();
