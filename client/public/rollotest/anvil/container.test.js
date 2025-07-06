/*
rolloanvil/container
*/

const { AnvilContainer } = await use("/components/anvil/container.x.html");


const plot = await AnvilContainer({ src: "plot" });

component.menu(
  "px-2.flex.gap-x-3",
  { parent: app },
  component.button(
    "btn.btn-primary",
    { "@click": (event) => plot.show() },
    "Show"
  ),
  component.button(
    "btn.btn-primary",
    { "@click": (event) => plot.hide() },
    "Hide"
  )
);

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