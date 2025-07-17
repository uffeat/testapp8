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
        main.attribute.modal = true;
        main.api.foo({}, { timeout: false }).then((result) => {
          console.log("Result:", result);

          main.attribute.modal = false;
        });
      },
    },
    "Show modal"
  )
);

await (async () => {
  main.api
    .echo({ echo: "Oh, my echo!" })
    .then((result) => console.log("Result:", result));
})();

/*
const echo = await use("echo.py");
echo({ echo: "echo!echo" }).then((result) => console.log(result));
*/
