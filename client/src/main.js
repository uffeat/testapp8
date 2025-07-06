//await use("@/rollotest/");



document.querySelector("html").dataset.bsTheme = "dark";

console.info("Environment:", app.meta.env.name);

const { camel_to_kebab } = await use("@/rollotools/text/case.js");

await (async () => {
  const data = {
    email: "name@company.com",
    score: 8,
    accept: true,
    bar: null,
    stuff: false,
  };

  const result = await anvil.server.foo(data);
  console.log("result:", result);

  console.log("maps:", app.imports.maps());

  const raw = await anvil.server.foo(data, { raw: true });
  console.log("raw:", raw);
})();
