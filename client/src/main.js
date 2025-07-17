/* tests */
use("@/rollotest/");

const { component } = await use("@/rollocomponent/");

component.h1({ parent: app }, "On a roll, Hugo!");

const { main } = await use("@/rolloanvil/");

await main.connect({}, (signal) =>
  console.log("Receiver got signal:", signal.data)
);

component.menu(
  "px-2.flex.gap-x-3",
  { parent: app },
  component.button(
    "btn.btn-primary",
    {
      "@click": async (event) => {
        main.attribute.plot = false;

        await main.api.clear();

        main.attribute.modal = true;
        await main.api.modal({}, { timeout: false });
        main.attribute.modal = false;
      },
    },
    "Show modal"
  ),
  component.button(
    "btn.btn-primary",
    {
      "@click": async (event) => {
        main.attribute.plot = true;
        await main.api.plot(
          [
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
          { timeout: false }
        );
      },
    },
    "Show plot"
  ),
  component.button(
    "btn.btn-primary",
    {
      "@click": (event) => {
        main.api.clear();
        main.attribute.plot = false;
      },
    },
    "Hide plot"
  )
);

await (async () => {
  main.api
    .echo({ echo: "Oh, my echo!" })
    .then((result) => console.log("Result:", result));
})();

await (async () => {
  const result = await main.api.test();
  console.log("Result:", result);
})();

/*
const echo = await use("echo.py");
echo({ echo: "echo!echo" }).then((result) => console.log(result));
*/
