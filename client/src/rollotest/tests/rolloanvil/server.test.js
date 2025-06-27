/*
rolloanvil/server
*/

const { anvil } = await use("@/rolloanvil/anvil.js");

await (async () => {
  const data = {
    email: "name@company.com",
    score: 8,
    accept: true,
    bar: null,
    stuff: false,
  };

  const result = await server.foo(data);
  console.log("result:", result);

  const raw = await anvil.server.foo(data, { raw: true });
  console.log("raw:", raw);
})();
