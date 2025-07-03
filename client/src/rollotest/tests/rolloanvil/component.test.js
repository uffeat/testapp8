
const { AnvilComponent } = await use("@/rolloanvil/component.js");

const bar = AnvilComponent({ src: "bar", parent: app });

await bar.anvil({
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


bar.remove()
bar.parent = app
await bar.anvil();


//await bar.connect()
//await bar.anvil();