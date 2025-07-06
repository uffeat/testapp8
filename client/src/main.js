//await use("@/rollotest/");

document.querySelector("html").dataset.bsTheme = "dark";

console.info(
  "Environment:",
  import.meta.env.DEV ? "development" : import.meta.env.VERCEL_ENV
);




//const { anvil } = await use("@/rolloanvil/");

const Input = await use("/components/form/input.x.html");

  const uffe = Input({
    parent: app,
    name: "uffe",
    //value: 'uff',
    required: true,
    validators: [
      (value) => {
        if (value !== "uffe") {
          return "Not uffe";
        }
      },
    ],
  });

