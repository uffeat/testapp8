await use("@/rollotest/");

document.querySelector("html").dataset.bsTheme = "dark";

console.info(
  "Environment:",
  import.meta.env.DEV ? "development" : import.meta.env.VERCEL_ENV
);

const { component } = await use("@/rollocomponent/");
const { AnvilContainer } = await use("/components/anvil/container.x.html");


const bar = await AnvilContainer({ src: "bar" });

component.h1({parent: app}, 'Headline')
component.menu(
  "px-2.flex.gap-x-3",
  { parent: app },
  component.button(
    "btn.btn-primary",
    { "@click": (event) => bar.show() },
    "Show"
  ),
  component.button(
    "btn.btn-primary",
    { "@click": (event) => bar.hide() },
    "Hide"
  )
);


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
