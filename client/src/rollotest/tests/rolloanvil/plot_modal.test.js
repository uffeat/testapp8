const { AnvilModal } = await use("/components/anvil/modal.x.html");

const bar = await AnvilModal("bar");

await bar.component.update({
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

component.menu(
  "px-2.flex",
  { parent: app },
  component.button(
    "btn.btn-primary",
    { "@click": (event) => bar.show() },
    "Show"
  )
);
